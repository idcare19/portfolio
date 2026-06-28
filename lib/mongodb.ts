import "server-only";

import mongoose, { type ConnectOptions } from "mongoose";

declare global {
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
        lastUri: string | null;
        activeConnectionUriLabel: "primary" | "fallback" | null;
        primaryFailureCooldownUntil: number;
        primaryFailureCategory: FailureCategory | null;
      }
    | undefined;
}

const PRIMARY_FAILURE_COOLDOWN_MS = 60_000;

const globalCache = global.mongooseCache || {
  conn: null,
  promise: null,
  lastUri: null,
  activeConnectionUriLabel: null,
  primaryFailureCooldownUntil: 0,
  primaryFailureCategory: null,
};
global.mongooseCache = globalCache;

const DEFAULT_SERVER_SELECTION_TIMEOUT_MS = 8000;
const DEFAULT_CONNECT_TIMEOUT_MS = 8000;

type MongoProtocol = "mongodb" | "mongodb+srv";

type MongoUriInfo = {
  raw: string;
  protocol: MongoProtocol;
  hosts: string[];
  database: string | null;
  queryParams: Record<string, string>;
  hasUsername: boolean;
  username: string | null;
  password: string | null;
  isSrv: boolean;
  safeUri: string;
};

type ParsedUriResult =
  | { ok: true; info: MongoUriInfo }
  | { ok: false; error: string };

type FailureCategory =
  | "dns-srv-lookup"
  | "authentication"
  | "network-access"
  | "invalid-uri"
  | "missing-database-user"
  | "unknown";

type CredentialDiagnostics = {
  usernameExists: boolean;
  usernameLength: number;
  passwordExists: boolean;
  passwordLength: number;
  usernamePlaceholderDetected: boolean;
  passwordPlaceholderDetected: boolean;
  usernameDecodedLength: number;
  passwordDecodedLength: number;
  usernameLooksEncoded: boolean;
  passwordLooksEncoded: boolean;
  passwordHasUnsafeCharacters: boolean;
};

export type MongoConnectionAttempt = {
  label: "primary" | "fallback";
  protocol?: MongoProtocol;
  hosts: string[];
  database: string | null;
  authSource?: string | null;
  hasUsername: boolean;
  isSrv: boolean;
  parseOk: boolean;
  parseError?: string;
  credentialDiagnostics?: CredentialDiagnostics;
  success?: boolean;
  errorCode?: string;
  errorMessage?: string;
  failureCategory?: FailureCategory;
  envVar?: "MONGODB_URI" | "MONGODB_URI_FALLBACK";
};

export type MongoConnectionDebug = {
  envExists: boolean;
  fallbackEnvExists: boolean;
  activeConnectionUriLabel?: "primary" | "fallback" | null;
  overallDiagnosis?: {
    failingEnvVar: "MONGODB_URI" | "MONGODB_URI_FALLBACK" | null;
    problemType: FailureCategory | "none";
    summary: string;
  };
  primaryUri: Omit<MongoConnectionAttempt, "label"> | null;
  fallbackUri: Omit<MongoConnectionAttempt, "label"> | null;
  attempts: MongoConnectionAttempt[];
};

const PLACEHOLDER_VALUES = new Set([
  "USER",
  "USERNAME",
  "PASSWORD",
  "YOUR_PASSWORD",
  "CHANGE_ME",
  "ADMIN",
  "YOUR_USERNAME",
  "YOUR_USER",
  "PLACEHOLDER",
]);

function getMongoOptions(): ConnectOptions {
  return {
    bufferCommands: false,
    dbName: process.env.MONGODB_DB_NAME || "portfolio",
    serverSelectionTimeoutMS: DEFAULT_SERVER_SELECTION_TIMEOUT_MS,
    connectTimeoutMS: DEFAULT_CONNECT_TIMEOUT_MS,
  };
}

function scrubErrorMessage(message: string) {
  return message.replace(/\/\/([^:@/]+):([^@/]+)@/g, "//$1:***@");
}

function getErrorCode(error: unknown) {
  if (typeof error === "object" && error && "code" in error && typeof (error as { code?: unknown }).code === "string") {
    return (error as { code: string }).code;
  }
  return undefined;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return scrubErrorMessage(error.message);
  }
  return "Unknown MongoDB error";
}

function encodeMongoCredential(value: string) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}

function hasUnsafeMongoCredential(value: string) {
  return /[@/:?#\[\]%]/.test(value);
}

function isPlaceholderCredential(value: string | null) {
  if (!value) return false;
  return PLACEHOLDER_VALUES.has(value.trim().toUpperCase());
}

function buildCredentialHint(uri: string) {
  const schemeIndex = uri.indexOf("://");
  const atIndex = uri.indexOf("@");
  if (schemeIndex === -1 || atIndex === -1) return null;

  const authPart = uri.slice(schemeIndex + 3, atIndex);
  const colonIndex = authPart.indexOf(":");
  if (colonIndex === -1) return null;

  const username = authPart.slice(0, colonIndex);
  const password = authPart.slice(colonIndex + 1);

  return {
    hasUsername: Boolean(username),
    usernameLooksEncoded: username === encodeMongoCredential(decodeURIComponentSafe(username)),
    passwordHasUnsafeCharacters: hasUnsafeMongoCredential(password),
    encodedUsernameExample: username ? encodeMongoCredential(decodeURIComponentSafe(username)) : "",
    encodedPasswordExample: password ? encodeMongoCredential(decodeURIComponentSafe(password)) : "",
  };
}

function getCredentialDiagnostics(username: string | null, password: string | null): CredentialDiagnostics {
  const decodedUsername = username ? decodeURIComponentSafe(username) : "";
  const decodedPassword = password ? decodeURIComponentSafe(password) : "";

  return {
    usernameExists: Boolean(username),
    usernameLength: username?.length || 0,
    passwordExists: Boolean(password),
    passwordLength: password?.length || 0,
    usernamePlaceholderDetected: isPlaceholderCredential(decodedUsername),
    passwordPlaceholderDetected: isPlaceholderCredential(decodedPassword),
    usernameDecodedLength: decodedUsername.length,
    passwordDecodedLength: decodedPassword.length,
    usernameLooksEncoded: username ? username === encodeMongoCredential(decodedUsername) : false,
    passwordLooksEncoded: password ? password === encodeMongoCredential(decodedPassword) : false,
    passwordHasUnsafeCharacters: password ? hasUnsafeMongoCredential(password) : false,
  };
}

function classifyFailure(errorCode?: string, errorMessage?: string): FailureCategory {
  const message = (errorMessage || "").toLowerCase();
  const code = (errorCode || "").toUpperCase();

  if (code === "ECONNREFUSED" || code === "ENOTFOUND" || message.includes("querysrv") || message.includes("dns")) {
    return "dns-srv-lookup";
  }
  if (message.includes("authentication failed") || message.includes("bad auth") || message.includes("auth failed")) {
    return "authentication";
  }
  if (message.includes("ip") && message.includes("allow")) {
    return "network-access";
  }
  if (message.includes("could not find user") || message.includes("user not found") || message.includes("no users authenticated")) {
    return "missing-database-user";
  }
  if (message.includes("uri") || message.includes("invalid")) {
    return "invalid-uri";
  }
  return "unknown";
}

function decodeURIComponentSafe(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function parseMongoUri(uri: string): ParsedUriResult {
  const trimmed = uri.trim();
  if (!trimmed) {
    return { ok: false, error: "URI is empty" };
  }

  const schemeMatch = trimmed.match(/^(mongodb(?:\+srv)?):\/\//i);
  if (!schemeMatch) {
    return { ok: false, error: "URI must start with mongodb:// or mongodb+srv://" };
  }

  const protocol = schemeMatch[1].toLowerCase() as MongoProtocol;
  const isSrv = protocol === "mongodb+srv";
  const rest = trimmed.slice(schemeMatch[0].length);
  const firstSlash = rest.indexOf("/");
  if (firstSlash === -1) {
    return { ok: false, error: "URI must include a database path like /database" };
  }

  const authority = rest.slice(0, firstSlash);
  const pathAndQuery = rest.slice(firstSlash + 1);
  if (!authority) {
    return { ok: false, error: "URI is missing host information" };
  }

  const authEnd = authority.lastIndexOf("@");
  const authPart = authEnd >= 0 ? authority.slice(0, authEnd) : "";
  const hostsPart = authEnd >= 0 ? authority.slice(authEnd + 1) : authority;
  if (!hostsPart) {
    return { ok: false, error: "URI is missing host list" };
  }

  const hosts = hostsPart.split(",").map((host) => host.trim()).filter(Boolean);
  if (hosts.length === 0) {
    return { ok: false, error: "URI host list is empty" };
  }

  if (isSrv && hosts.length > 1) {
    return { ok: false, error: "mongodb+srv URI must contain exactly one host" };
  }

  const invalidHost = hosts.find((host) => !/^[^/\s]+(?::\d+)?$/.test(host));
  if (invalidHost) {
    return { ok: false, error: `Invalid host entry: ${invalidHost}` };
  }

  if (!isSrv) {
    const hostWithoutPort = hosts.find((host) => !host.includes(":"));
    if (hostWithoutPort) {
      return { ok: false, error: `Standard mongodb:// fallback hosts must include a port. Problem host: ${hostWithoutPort}` };
    }
  }

  let username: string | null = null;
  let password: string | null = null;
  if (authPart) {
    const colonIndex = authPart.indexOf(":");
    if (colonIndex === -1) {
      return { ok: false, error: "Credentials must be in USER:PASSWORD format before @" };
    }

    username = authPart.slice(0, colonIndex);
    password = authPart.slice(colonIndex + 1);
    if (!username) {
      return { ok: false, error: "Username is empty in credentials section" };
    }

    if (password && hasUnsafeMongoCredential(password) && !/%[0-9A-Fa-f]{2}/.test(password)) {
      return {
        ok: false,
        error: "Password appears to contain special characters that must be URL-encoded in MongoDB URI",
      };
    }
  }

  const [databasePart, query = ""] = pathAndQuery.split("?");
  const database = databasePart.trim() || null;
  if (!database) {
    return { ok: false, error: "Database name is missing in URI path" };
  }

  const queryParams = Object.fromEntries(new URLSearchParams(query).entries());
  const safeAuth = authPart
    ? `${authPart.includes(":") ? `${authPart.slice(0, authPart.indexOf(":"))}:***` : "***"}@`
    : "";

  return {
    ok: true,
    info: {
      raw: trimmed,
      protocol,
      hosts,
      database,
      queryParams,
      hasUsername: Boolean(authPart),
      username,
      password,
      isSrv,
      safeUri: `${protocol}://${safeAuth}${hosts.join(",")}/${database}${query ? `?${query}` : ""}`,
    },
  };
}

function getPrimaryMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI");
  }
  return uri;
}

function getFallbackMongoUri() {
  return process.env.MONGODB_URI_FALLBACK || null;
}

function hasActiveMongooseConnection() {
  return mongoose.connection.readyState === 1;
}

function hasPendingMongooseConnection() {
  return mongoose.connection.readyState === 2;
}

function isPrimaryFailureCoolingDown() {
  return globalCache.primaryFailureCooldownUntil > Date.now();
}

function markPrimaryFailureCooldown(category: FailureCategory) {
  globalCache.primaryFailureCategory = category;
  globalCache.primaryFailureCooldownUntil = Date.now() + PRIMARY_FAILURE_COOLDOWN_MS;
  global.mongooseCache = globalCache;
}

function clearPrimaryFailureCooldown() {
  globalCache.primaryFailureCategory = null;
  globalCache.primaryFailureCooldownUntil = 0;
  global.mongooseCache = globalCache;
}

function attemptFromParsed(label: "primary" | "fallback", parsed: ParsedUriResult): MongoConnectionAttempt {
  if (!parsed.ok) {
    return {
      label,
      hosts: [],
      database: null,
      authSource: null,
      hasUsername: false,
      isSrv: false,
      parseOk: false,
      parseError: parsed.error,
      failureCategory: "invalid-uri",
    };
  }

  return {
    label,
    protocol: parsed.info.protocol,
    hosts: parsed.info.hosts,
    database: parsed.info.database,
    authSource: parsed.info.queryParams.authSource || null,
    hasUsername: parsed.info.hasUsername,
    isSrv: parsed.info.isSrv,
    parseOk: true,
    credentialDiagnostics: getCredentialDiagnostics(parsed.info.username, parsed.info.password),
  };
}

function getCredentialValidationError(parsed: ParsedUriResult, label: "primary" | "fallback") {
  if (!parsed.ok) return null;

  const diagnostics = getCredentialDiagnostics(parsed.info.username, parsed.info.password);
  if (!diagnostics.usernameExists) {
    return `${label} URI is missing a username`;
  }
  if (!diagnostics.passwordExists) {
    return `${label} URI is missing a password`;
  }
  if (diagnostics.usernamePlaceholderDetected) {
    return `${label} URI username looks like a placeholder and must be replaced with a real Atlas database user`;
  }
  if (diagnostics.passwordPlaceholderDetected) {
    return `${label} URI password looks like a placeholder and must be replaced with the real Atlas database user password`;
  }
  return null;
}

async function connectWithUri(uri: string, label: "primary" | "fallback") {
  if (hasActiveMongooseConnection()) {
    globalCache.conn = mongoose;
    globalCache.promise = null;
    globalCache.lastUri = globalCache.lastUri || uri;
    globalCache.activeConnectionUriLabel = globalCache.activeConnectionUriLabel || label;
    global.mongooseCache = globalCache;
    return mongoose;
  }

  if (hasPendingMongooseConnection() && globalCache.promise) {
    return globalCache.promise;
  }

  if (globalCache.conn && globalCache.lastUri === uri) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    globalCache.lastUri = uri;
    globalCache.promise = mongoose.connect(uri, getMongoOptions());
  }

  try {
    globalCache.conn = await globalCache.promise;
    globalCache.promise = null;
    globalCache.lastUri = uri;
    globalCache.activeConnectionUriLabel = label;
    if (label === "primary") {
      clearPrimaryFailureCooldown();
    }
    global.mongooseCache = globalCache;
    return globalCache.conn;
  } catch (error) {
    globalCache.promise = null;
    if (!hasActiveMongooseConnection()) {
      globalCache.conn = null;
      globalCache.lastUri = null;
      globalCache.activeConnectionUriLabel = null;
    }
    global.mongooseCache = globalCache;
    throw error;
  }
}

function shouldTryFallback(parsedPrimary: ParsedUriResult, error: unknown) {
  if (!parsedPrimary.ok || !parsedPrimary.info.isSrv) return false;

  const code = getErrorCode(error);
  const message = getErrorMessage(error).toLowerCase();
  return code === "ECONNREFUSED" || code === "ENOTFOUND" || message.includes("querysrv") || message.includes("dns");
}

function logUriDetails(prefix: string, parsed: ParsedUriResult, extra?: Record<string, unknown>) {
  if (!parsed.ok) {
    console.error(prefix, {
      parseOk: false,
      parseError: parsed.error,
      ...(extra || {}),
    });
    return;
  }

  console.error(prefix, {
    protocol: parsed.info.protocol,
    hosts: parsed.info.hosts,
    database: parsed.info.database,
    authSource: parsed.info.queryParams.authSource || null,
    hasUsername: parsed.info.hasUsername,
    safeUri: parsed.info.safeUri,
    credentialDiagnostics: getCredentialDiagnostics(parsed.info.username, parsed.info.password),
    ...(extra || {}),
  });
}

function getConnectionOrder(options: { fallbackUri: string | null }) {
  const isLocal = process.env.NODE_ENV !== "production";
  const preferFallbackFirst = Boolean(options.fallbackUri && isLocal && isPrimaryFailureCoolingDown());

  return preferFallbackFirst
    ? ([
        { label: "fallback" as const, uri: options.fallbackUri! },
        { label: "primary" as const, uri: getPrimaryMongoUri() },
      ])
    : ([
        { label: "primary" as const, uri: getPrimaryMongoUri() },
        ...(options.fallbackUri ? [{ label: "fallback" as const, uri: options.fallbackUri }] : []),
      ]);
}

export async function connectToDatabase() {
  if (hasActiveMongooseConnection()) {
    globalCache.conn = mongoose;
    globalCache.promise = null;
    global.mongooseCache = globalCache;
    return mongoose;
  }

  if (globalCache.promise) {
    return globalCache.promise;
  }

  const primaryUri = getPrimaryMongoUri();
  const primaryParsed = parseMongoUri(primaryUri);

  if (!primaryParsed.ok) {
    logUriDetails("[mongodb] Primary URI invalid", primaryParsed);
    throw new Error(`Invalid MONGODB_URI: ${primaryParsed.error}`);
  }

  const primaryCredentialError = getCredentialValidationError(primaryParsed, "primary");
  if (primaryCredentialError) {
    logUriDetails("[mongodb] Primary credentials invalid", primaryParsed, {
      validationError: primaryCredentialError,
    });
    throw new Error(primaryCredentialError);
  }

  const fallbackUri = getFallbackMongoUri();
  const fallbackParsed = fallbackUri ? parseMongoUri(fallbackUri) : null;

  for (const target of getConnectionOrder({ fallbackUri })) {
    if (target.label === "fallback") {
      if (!fallbackParsed?.ok) {
        const credentialHint = target.uri ? buildCredentialHint(target.uri) : null;
        logUriDetails("[mongodb] Fallback URI skipped", fallbackParsed || { ok: false, error: "Fallback URI missing" }, {
          credentialHint,
        });
        continue;
      }

      const fallbackCredentialError = getCredentialValidationError(fallbackParsed, "fallback");
      if (fallbackCredentialError) {
        logUriDetails("[mongodb] Fallback credentials invalid", fallbackParsed, {
          validationError: fallbackCredentialError,
        });
        continue;
      }
    }

    let retryCount = 0;
    while (retryCount <= 1) {
      try {
        return await connectWithUri(target.uri, target.label);
      } catch (error) {
        if (target.label === "primary") {
          const category = classifyFailure(getErrorCode(error), getErrorMessage(error));
          
          if (retryCount === 0 && (category === "dns-srv-lookup" || getErrorCode(error) === "ECONNREFUSED")) {
            console.warn(`[mongodb] Primary connection failed with ${category}, retrying once in 1s...`);
            retryCount++;
            await new Promise((res) => setTimeout(res, 1000));
            continue;
          }

          markPrimaryFailureCooldown(category);
          logUriDetails("[mongodb] Primary connection failed", primaryParsed, {
            code: getErrorCode(error),
            message: getErrorMessage(error),
            cooldownMs: PRIMARY_FAILURE_COOLDOWN_MS,
          });

          if (!(fallbackUri && shouldTryFallback(primaryParsed, error))) {
            throw error;
          }
          break; // break retry loop to try fallback
        }

        if (fallbackParsed?.ok) {
          logUriDetails("[mongodb] Fallback connection failed", fallbackParsed, {
            code: getErrorCode(error),
            message: getErrorMessage(error),
          });
        }
        throw error;
      }
    }
  }

  throw new Error("Unable to establish MongoDB connection with available URIs");
}

export async function getMongoConnectionDebug(): Promise<MongoConnectionDebug> {
  const envExists = Boolean(process.env.MONGODB_URI);
  const fallbackEnvExists = Boolean(process.env.MONGODB_URI_FALLBACK);
  const attempts: MongoConnectionAttempt[] = [];

  if (!envExists) {
    return {
      envExists,
      fallbackEnvExists,
      activeConnectionUriLabel: globalCache.activeConnectionUriLabel,
      primaryUri: null,
      fallbackUri: null,
      attempts,
    };
  }

  const primaryUri = getPrimaryMongoUri();
  const primaryParsed = parseMongoUri(primaryUri);
  const fallbackUri = getFallbackMongoUri();
  const fallbackParsed = fallbackUri ? parseMongoUri(fallbackUri) : null;

  const primaryMeta = primaryParsed.ok
    ? {
        protocol: primaryParsed.info.protocol,
        hosts: primaryParsed.info.hosts,
        database: primaryParsed.info.database,
        authSource: primaryParsed.info.queryParams.authSource || null,
        hasUsername: primaryParsed.info.hasUsername,
        isSrv: primaryParsed.info.isSrv,
        parseOk: true,
        credentialDiagnostics: getCredentialDiagnostics(primaryParsed.info.username, primaryParsed.info.password),
      }
    : {
        hosts: [],
        database: null,
        authSource: null,
        hasUsername: false,
        isSrv: false,
        parseOk: false,
        parseError: primaryParsed.error,
        failureCategory: "invalid-uri" as const,
      };

  const fallbackMeta = fallbackParsed
    ? fallbackParsed.ok
      ? {
          protocol: fallbackParsed.info.protocol,
          hosts: fallbackParsed.info.hosts,
          database: fallbackParsed.info.database,
          authSource: fallbackParsed.info.queryParams.authSource || null,
          hasUsername: fallbackParsed.info.hasUsername,
          isSrv: fallbackParsed.info.isSrv,
          parseOk: true,
          credentialDiagnostics: getCredentialDiagnostics(fallbackParsed.info.username, fallbackParsed.info.password),
        }
      : {
          hosts: [],
          database: null,
          authSource: null,
          hasUsername: false,
          isSrv: false,
          parseOk: false,
          parseError: fallbackParsed.error,
          failureCategory: "invalid-uri" as const,
        }
    : null;

  if (!primaryParsed.ok) {
    attempts.push({ ...attemptFromParsed("primary", primaryParsed), envVar: "MONGODB_URI" });
    return {
      envExists,
      fallbackEnvExists,
      overallDiagnosis: {
        failingEnvVar: "MONGODB_URI",
        problemType: "invalid-uri",
        summary: "MONGODB_URI is invalid and must be corrected before MongoDB can connect.",
      },
      activeConnectionUriLabel: globalCache.activeConnectionUriLabel,
      primaryUri: primaryMeta,
      fallbackUri: fallbackMeta,
      attempts,
    };
  }

  const primaryCredentialError = getCredentialValidationError(primaryParsed, "primary");
  if (primaryCredentialError) {
    attempts.push({
      ...attemptFromParsed("primary", primaryParsed),
      envVar: "MONGODB_URI",
      success: false,
      errorMessage: primaryCredentialError,
      failureCategory: "authentication",
    });
    return {
      envExists,
      fallbackEnvExists,
      overallDiagnosis: {
        failingEnvVar: "MONGODB_URI",
        problemType: "authentication",
        summary: "MONGODB_URI credentials look invalid before connection. Replace placeholder or incorrect database-user credentials.",
      },
      activeConnectionUriLabel: globalCache.activeConnectionUriLabel,
      primaryUri: primaryMeta,
      fallbackUri: fallbackMeta,
      attempts,
    };
  }

  try {
    await connectWithUri(primaryUri, "primary");
    attempts.push({
      ...attemptFromParsed("primary", primaryParsed),
      envVar: "MONGODB_URI",
      success: true,
    });

    return {
      envExists,
      fallbackEnvExists,
      overallDiagnosis: {
        failingEnvVar: null,
        problemType: "none",
        summary: "Primary MongoDB URI connected successfully.",
      },
      activeConnectionUriLabel: globalCache.activeConnectionUriLabel,
      primaryUri: primaryMeta,
      fallbackUri: fallbackMeta,
      attempts,
    };
  } catch (error) {
    attempts.push({
      ...attemptFromParsed("primary", primaryParsed),
      envVar: "MONGODB_URI",
      success: false,
      errorCode: getErrorCode(error),
      errorMessage: getErrorMessage(error),
      failureCategory: classifyFailure(getErrorCode(error), getErrorMessage(error)),
    });

    if (fallbackUri && shouldTryFallback(primaryParsed, error)) {
      if (!fallbackParsed) {
        return {
          envExists,
          fallbackEnvExists,
          overallDiagnosis: {
            failingEnvVar: "MONGODB_URI",
            problemType: classifyFailure(getErrorCode(error), getErrorMessage(error)),
            summary: "Primary SRV connection failed and no fallback URI is configured.",
          },
          activeConnectionUriLabel: globalCache.activeConnectionUriLabel,
          primaryUri: primaryMeta,
          fallbackUri: fallbackMeta,
          attempts,
        };
      }

      if (!fallbackParsed.ok) {
        attempts.push({
          ...attemptFromParsed("fallback", fallbackParsed),
          envVar: "MONGODB_URI_FALLBACK",
        });
        return {
          envExists,
          fallbackEnvExists,
          overallDiagnosis: {
            failingEnvVar: "MONGODB_URI_FALLBACK",
            problemType: "invalid-uri",
            summary: "Primary SRV lookup failed and MONGODB_URI_FALLBACK is invalid.",
          },
          activeConnectionUriLabel: globalCache.activeConnectionUriLabel,
          primaryUri: primaryMeta,
          fallbackUri: fallbackMeta,
          attempts,
        };
      }

      const fallbackCredentialError = getCredentialValidationError(fallbackParsed, "fallback");
      if (fallbackCredentialError) {
        attempts.push({
          ...attemptFromParsed("fallback", fallbackParsed),
          envVar: "MONGODB_URI_FALLBACK",
          success: false,
          errorMessage: fallbackCredentialError,
          failureCategory: "authentication",
        });
        return {
          envExists,
          fallbackEnvExists,
          overallDiagnosis: {
            failingEnvVar: "MONGODB_URI_FALLBACK",
            problemType: "authentication",
            summary: "Primary SRV lookup failed and MONGODB_URI_FALLBACK contains placeholder or invalid credentials.",
          },
          activeConnectionUriLabel: globalCache.activeConnectionUriLabel,
          primaryUri: primaryMeta,
          fallbackUri: fallbackMeta,
          attempts,
        };
      }

      try {
        await connectWithUri(fallbackUri, "fallback");
        attempts.push({
          ...attemptFromParsed("fallback", fallbackParsed),
          envVar: "MONGODB_URI_FALLBACK",
          success: true,
        });
        return {
          envExists,
          fallbackEnvExists,
          overallDiagnosis: {
            failingEnvVar: "MONGODB_URI",
            problemType: "dns-srv-lookup",
            summary: "MONGODB_URI is failing on SRV/DNS lookup, but MONGODB_URI_FALLBACK connected successfully.",
          },
          activeConnectionUriLabel: globalCache.activeConnectionUriLabel,
          primaryUri: primaryMeta,
          fallbackUri: fallbackMeta,
          attempts,
        };
      } catch (fallbackError) {
        attempts.push({
          ...attemptFromParsed("fallback", fallbackParsed),
          envVar: "MONGODB_URI_FALLBACK",
          success: false,
          errorCode: getErrorCode(fallbackError),
          errorMessage: getErrorMessage(fallbackError),
          failureCategory: classifyFailure(getErrorCode(fallbackError), getErrorMessage(fallbackError)),
        });
      }
    }

    return {
      envExists,
      fallbackEnvExists,
      overallDiagnosis: {
        failingEnvVar:
          attempts.some((attempt) => attempt.label === "fallback" && attempt.success === false)
            ? "MONGODB_URI_FALLBACK"
            : "MONGODB_URI",
        problemType:
          attempts.find((attempt) => attempt.label === "fallback" && attempt.success === false)?.failureCategory ||
          attempts.find((attempt) => attempt.label === "primary" && attempt.success === false)?.failureCategory ||
          "unknown",
        summary:
          attempts.find((attempt) => attempt.label === "fallback" && attempt.success === false)?.failureCategory === "authentication"
            ? "MONGODB_URI_FALLBACK is failing authentication after primary SRV lookup failure."
            : "MongoDB connection failed. Check the attempt details for the exact environment variable and failure type.",
      },
      activeConnectionUriLabel: globalCache.activeConnectionUriLabel,
      primaryUri: primaryMeta,
      fallbackUri: fallbackMeta,
      attempts,
    };
  }
}

export function getMongoCredentialEncodingHelp() {
  const primaryUri = process.env.MONGODB_URI;
  const fallbackUri = process.env.MONGODB_URI_FALLBACK;

  return {
    primary: primaryUri ? buildCredentialHint(primaryUri) : null,
    fallback: fallbackUri ? buildCredentialHint(fallbackUri) : null,
    encodeMongoCredential,
  };
}
