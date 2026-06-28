"use client";

<<<<<<< HEAD
import { useMemo, useState } from "react";
import { useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";
import { buildAdminSections, buildGlobalTextBlocks, updateTextBlockValue } from "@/lib/admin/content-manager";
import type { SiteData, TextBlock } from "@/src/types/site-data";

type SectionGroup = {
  id: string;
  title: string;
  description: string;
  blocks: Array<TextBlock & { sectionId?: string }>;
};

const SECTION_LABELS: Record<string, string> = {
  global: "Global",
  hero: "Hero",
  about: "About",
  skills: "Skills",
  projects: "Projects",
  working: "Currently Working",
  completed: "Completed Projects",
  reviews: "Reviews",
  journey: "Experience",
  education: "Education",
  services: "Services",
  blogs: "Blogs",
  github: "GitHub",
  contact: "Contact",
  footer: "Footer",
};

const HUMAN_LABELS: Record<string, string> = {
  "owner.username": "Logo Text",
  "owner.identityLine": "Hero Badge",
  "owner.introLine": "Hero Heading",
  "owner.role": "Hero Subtitle",
  "owner.tagline": "Hero Description",
  "owner.resumeUrl": "Resume Button",
  "websiteSettings.footerText": "Footer Copyright",
};

function labelFor(block: TextBlock) {
  return HUMAN_LABELS[block.key] || block.label || block.key;
}

function groupsFromData(data: SiteData): SectionGroup[] {
  const adminSections = buildAdminSections(data);
  const globalBlocks = buildGlobalTextBlocks(data);

  return [
    { id: "global", title: "Global", description: "Logo, hero, social links, and footer copy.", blocks: globalBlocks },
    ...adminSections.map((section) => ({
      id: String(section.id),
      title: SECTION_LABELS[section.id] || section.label,
      description: section.data?.description ? String(section.data.description) : `Text blocks for ${SECTION_LABELS[section.id] || section.label}.`,
      blocks: (section.textBlocks || []).map((block) => ({ ...block, sectionId: section.id })),
    })),
  ];
}

function updateBlocks(next: SiteData, blocks: Array<TextBlock & { sectionId?: string }>) {
  let current = next;
  for (const block of blocks) {
    current = updateTextBlockValue(current, block);
  }
  return current;
}
=======
import { PageHeader } from "@/components/admin/PageHeader";
import { TextBlockManager } from "@/components/admin/TextBlockManager";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";
import { buildAdminSections, buildGlobalTextBlocks, updateTextBlockValue } from "@/lib/admin/content-manager";
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc

export default function TextBlocksAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save } = useSiteDataEditor();
<<<<<<< HEAD
  const [activeSection, setActiveSection] = useState("global");
  const [advancedMode, setAdvancedMode] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (data?.websiteControl?.developerMode) {
      setAdvancedMode(true);
    }
  }, [data?.websiteControl?.developerMode]);

  const groups = useMemo(() => (data ? groupsFromData(data) : []), [data]);
  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((group) => ({
        ...group,
        blocks: group.blocks.filter((block) => `${labelFor(block)} ${block.value}`.toLowerCase().includes(q)),
      }))
      .filter((group) => group.blocks.length > 0);
  }, [groups, query]);

  const activeGroup = filteredGroups.find((group) => group.id === activeSection) || filteredGroups[0] || null;

  async function handleSaveAll() {
=======

  async function handleSave() {
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
    if (!data) return;
    const result = await save(data, "chore: update text blocks from admin panel");
    if (result.ok) notify("success", "Text blocks saved");
    else notify("error", result.error || "Save failed");
  }

<<<<<<< HEAD
  function applySectionDraft(blocks: Array<TextBlock & { sectionId?: string }>) {
    if (!data) return;
    setData(updateBlocks(data, blocks));
  }

  async function saveSection(blocks: Array<TextBlock & { sectionId?: string }>, title: string) {
    if (!data) return;
    const next = updateBlocks(data, blocks);
    setData(next);
    const result = await save(next, `chore: update ${title.toLowerCase()} text blocks from admin panel`);
    if (result.ok) notify("success", `${title} saved`);
    else notify("error", result.error || `Failed to save ${title.toLowerCase()}`);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Website Sections"
        description="One editor for the public site copy with beginner mode by default and advanced mode for developer workflows."
      />
      {loading ? <p className="text-sm text-admin-text-muted">Loading text blocks...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

      {data ? (
        <div className="grid gap-4 lg:grid-cols-[260px,1fr]">
          <aside className="rounded-2xl border border-admin-border bg-admin-card p-4">
            <div className="space-y-3">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by label or value"
                className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
              />
              <label className="flex items-center gap-2 text-sm text-admin-text">
                <input type="checkbox" checked={advancedMode} onChange={(event) => setAdvancedMode(event.target.checked)} />
                Advanced Mode
              </label>
            </div>

            <div className="mt-4 space-y-2">
              {filteredGroups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setActiveSection(group.id)}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                    activeSection === group.id
                      ? "border-admin-primary bg-admin-primary/10 text-admin-primary"
                      : "border-admin-border bg-admin-bg text-admin-text hover:bg-admin-input"
                  }`}
                >
                  <span className="block font-semibold">{group.title}</span>
                  <span className="block text-xs text-admin-text-muted">{group.blocks.length} fields</span>
                </button>
              ))}
            </div>
          </aside>

          <main className="space-y-4">
            {activeGroup ? (
              <section className="rounded-2xl border border-admin-border bg-admin-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-admin-text">{activeGroup.title}</h2>
                    <p className="text-sm text-admin-text-muted">{activeGroup.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveSection(activeGroup.blocks, activeGroup.title)}
                      className="rounded-full border border-admin-border bg-admin-bg px-4 py-2 text-sm font-semibold text-admin-text"
                    >
                      Save {activeGroup.title}
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAll}
                      disabled={!data || saving}
                      className="rounded-full bg-admin-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-80"
                    >
                      {saving ? "Saving..." : "Save All Changes"}
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {activeGroup.blocks.map((block, index) => {
                    const showAdvanced = advancedMode;
                    const isLong = block.type === "rich" || block.type === "markdown" || block.value.length > 90;
                    return (
                      <label key={`${block.sectionId || "global"}-${block.key}-${index}`} className={`text-sm ${isLong ? "md:col-span-2" : ""}`}>
                        <span className="mb-1 block font-medium text-admin-text">{labelFor(block)}</span>
                        {isLong ? (
                          <textarea
                            rows={advancedMode ? 4 : 3}
                            value={block.value}
                            onChange={(event) =>
                              applySectionDraft(
                                activeGroup.blocks.map((item) =>
                                  item.key === block.key && item.sectionId === block.sectionId
                                    ? { ...item, value: event.target.value }
                                    : item
                                )
                              )
                            }
                            className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
                            placeholder={showAdvanced ? block.key : labelFor(block)}
                          />
                        ) : (
                          <input
                            value={block.value}
                            onChange={(event) =>
                              applySectionDraft(
                                activeGroup.blocks.map((item) =>
                                  item.key === block.key && item.sectionId === block.sectionId
                                    ? { ...item, value: event.target.value }
                                    : item
                                )
                              )
                            }
                            className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
                            placeholder={showAdvanced ? block.key : labelFor(block)}
                          />
                        )}
                        {advancedMode ? <span className="mt-1 block text-xs text-admin-text-muted">{block.key}</span> : null}
                      </label>
                    );
                  })}
                </div>
              </section>
            ) : null}

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={!data || saving}
              className="rounded-xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-80"
            >
              {saving ? "Saving..." : "Save All Changes"}
            </button>
          </main>
        </div>
      ) : null}
=======
  const sectionBlocks = data
    ? buildAdminSections(data).flatMap((section) => (section.textBlocks || []).map((block) => ({ ...block, sectionId: section.id })))
    : [];
  const globalBlocks = data ? buildGlobalTextBlocks(data) : [];

  return (
    <div className="space-y-4">
      <PageHeader title="Text Blocks" description="Edit every visible text block, CTA, badge, stat, and link on the website." />
      {loading ? <p className="text-sm text-admin-text-muted">Loading text blocks...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      {data ? (
        <>
          <TextBlockManager
            title="Global Text"
            description="Logo text, hero lines, footer text, and social labels/links."
            blocks={globalBlocks}
            onChange={(blocks) => {
              let next = data;
              blocks.forEach((block) => {
                next = updateTextBlockValue(next, block);
              });
              setData(next);
            }}
          />
          <TextBlockManager
            title="Section Text"
            description="Section titles, subtitles, descriptions, CTAs, badges, stats, and per-section copy."
            blocks={sectionBlocks}
            showSectionField
            onChange={(blocks) => {
              let next = data;
              blocks.forEach((block) => {
                next = updateTextBlockValue(next, { ...block, key: block.key });
              });
              setData(next);
            }}
          />
        </>
      ) : null}
      <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-80">{saving ? "Saving..." : "Save Text Blocks"}</button>
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
    </div>
  );
}
