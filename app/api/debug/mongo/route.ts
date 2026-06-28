import { NextResponse } from "next/server";
import { getMongoConnectionDebug, getMongoCredentialEncodingHelp } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const debug = await getMongoConnectionDebug();
    const credentialHelp = getMongoCredentialEncodingHelp();

    return NextResponse.json(
      {
        ok: true,
        envExists: debug.envExists,
        fallbackEnvExists: debug.fallbackEnvExists,
        overallDiagnosis: debug.overallDiagnosis,
        primaryUri: debug.primaryUri,
        fallbackUri: debug.fallbackUri,
        attempts: debug.attempts,
        credentialHints: {
          primary: credentialHelp.primary
            ? {
                hasUsername: credentialHelp.primary.hasUsername,
                usernameLooksEncoded: credentialHelp.primary.usernameLooksEncoded,
                passwordHasUnsafeCharacters: credentialHelp.primary.passwordHasUnsafeCharacters,
                encodedUsernameExample: credentialHelp.primary.encodedUsernameExample,
                encodedPasswordExample: credentialHelp.primary.encodedPasswordExample ? "***" : "",
              }
            : null,
          fallback: credentialHelp.fallback
            ? {
                hasUsername: credentialHelp.fallback.hasUsername,
                usernameLooksEncoded: credentialHelp.fallback.usernameLooksEncoded,
                passwordHasUnsafeCharacters: credentialHelp.fallback.passwordHasUnsafeCharacters,
                encodedUsernameExample: credentialHelp.fallback.encodedUsernameExample,
                encodedPasswordExample: credentialHelp.fallback.encodedPasswordExample ? "***" : "",
              }
            : null,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Mongo debug failed",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  }
}
