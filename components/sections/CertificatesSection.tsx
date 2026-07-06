"use client";

import Image from "next/image";
import type { SiteSectionBlock } from "@/src/types/site-data";

function cleanText(value: unknown) {
  return String(value || "").trim();
}

function resolveCertificateImage(item: any) {
  return cleanText(item?.certificateImage || item?.image || item?.thumbnail);
}

function formatCertificateDate(value: unknown) {
  const raw = cleanText(value);
  if (!raw) return "";
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

export function CertificatesSection({ section }: { section: SiteSectionBlock }) {
  const items = (section?.items || []).filter((item: any) => item.isEnabled !== false).sort((a: any, b: any) => Number(a.order || 0) - Number(b.order || 0));
  return (
    <section id="certificates" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-[rgb(var(--border))] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{String(section.data?.eyebrow || "Credentials")}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-main">{String(section.data?.title || "Certificates")}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item: any, index: number) => (
            <article key={item.certificateTitle || item.title || index} className="overflow-hidden rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
              <div className="relative aspect-[16/10] bg-slate-100">
                {resolveCertificateImage(item) ? (
                  <Image
                    src={resolveCertificateImage(item)}
                    alt={cleanText(item?.certificateTitle || item?.title || "Certificate")}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 px-6 text-center">
                    <div>
                      <div className="mx-auto h-12 w-12 rounded-2xl border border-dashed border-slate-300 bg-white" />
                      <p className="mt-3 text-sm font-medium text-slate-500">Certificate image unavailable</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <h3 className="text-lg font-semibold text-text-main">{item.certificateTitle || item.title || "Certificate"}</h3>
                  {cleanText(item.issuer) ? <p className="mt-1 text-sm text-text-muted">{cleanText(item.issuer)}</p> : null}
                </div>
                <div className="space-y-2 text-sm text-text-muted">
                  {cleanText(item.credentialId) ? <p><span className="font-medium text-text-main">Credential ID:</span> {cleanText(item.credentialId)}</p> : null}
                  {(formatCertificateDate(item.issueDate) || formatCertificateDate(item.expiryDate)) ? (
                    <div className="space-y-1">
                      {formatCertificateDate(item.issueDate) ? <p><span className="font-medium text-text-main">Issued:</span> {formatCertificateDate(item.issueDate)}</p> : null}
                      <p><span className="font-medium text-text-main">Expires:</span> {formatCertificateDate(item.expiryDate) || "No Expiry"}</p>
                    </div>
                  ) : null}
                  {cleanText(item.category) ? <p><span className="font-medium text-text-main">Category:</span> {cleanText(item.category)}</p> : null}
                </div>
                {cleanText(item.skills) ? (
                  <div className="flex flex-wrap gap-2">
                    {cleanText(item.skills)
                      .split(",")
                      .map((skill: string) => skill.trim())
                      .filter(Boolean)
                      .map((skill: string) => (
                        <span key={skill} className="rounded-full border border-[rgb(var(--border))] bg-white px-3 py-1 text-xs font-medium text-text-muted">
                          {skill}
                        </span>
                      ))}
                  </div>
                ) : null}
                {cleanText(item.credentialUrl) ? (
                  <a
                    href={cleanText(item.credentialUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    View Credential
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
