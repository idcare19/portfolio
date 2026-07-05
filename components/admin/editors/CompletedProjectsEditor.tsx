"use client";

import type { ProjectItem, SiteData } from "@/src/types/site-data";
import { ProjectsEditor } from "@/components/admin/editors/ProjectsEditor";

function toCompletedProjectItem(project: ProjectItem) {
  return {
    ...project,
    title: project.title,
    timeline: project.timeline || project.duration || "",
    role: project.myRole || "",
    link: project.liveDemoUrl || project.caseStudyUrl || project.githubUrl || "",
    workDone: project.shortDescription || project.longDescription || "",
  };
}

export function CompletedProjectsEditor({
  data,
  onChange,
}: {
  data: SiteData;
  onChange: (next: SiteData) => void;
}) {
  const completedProjects = ((data.sections?.completed?.items as ProjectItem[] | undefined) || []).map((item, index) => ({
    ...item,
    id: String(item.id || `completed-${index + 1}`),
    title: String(item.title || ""),
    shortDescription: String(item.shortDescription || (item as any).workDone || ""),
    longDescription: String(item.longDescription || (item as any).workDone || ""),
    liveDemoUrl: String(item.liveDemoUrl || (item as any).link || ""),
    myRole: String(item.myRole || (item as any).role || ""),
    timeline: String(item.timeline || (item as any).timeline || ""),
    category: String(item.category || "Completed"),
    status: String(item.status || "Completed"),
    projectType: String(item.projectType || "Completed Project"),
    isEnabled: item.isEnabled !== false,
  }));

  const completedData: SiteData = {
    ...data,
    projectsDetailed: completedProjects,
    projects: completedProjects.map((project) => ({
      title: project.title,
      description: project.shortDescription,
      image: project.image,
      tech: project.techStack,
      liveUrl: project.liveDemoUrl,
      githubUrl: project.githubUrl,
      isEnabled: project.isEnabled,
    })),
  };

  function handleChange(next: SiteData) {
    const nextCompleted = next.projectsDetailed.map((project) => toCompletedProjectItem(project));
    onChange({
      ...next,
      sections: {
        ...(next.sections || {}),
        completed: {
          ...(next.sections?.completed || {}),
          id: "completed",
          label: next.sections?.completed?.label || "completed",
          renderer: next.sections?.completed?.renderer || "completed",
          enabled: next.sections?.completed?.enabled ?? true,
          order: next.sections?.completed?.order ?? 0,
          layout: next.sections?.completed?.layout || "default",
          status: next.sections?.completed?.status || "published",
          nav: next.sections?.completed?.nav || { show: false, href: "#completed", label: "completed" },
          emptyMessage: next.sections?.completed?.emptyMessage || "",
          textBlocks: next.sections?.completed?.textBlocks || [],
          settings: next.sections?.completed?.settings || {},
          data: next.sections?.completed?.data || {},
          items: nextCompleted as any,
          showOnHomepage: next.sections?.completed?.showOnHomepage ?? true,
        },
      },
      completedProjects: nextCompleted.map((project) => ({
        title: project.title,
        timeline: project.timeline || "",
        role: project.role || "",
        link: project.link || "",
        workDone: project.workDone || "",
      })),
    });
  }

  return <ProjectsEditor data={completedData} onChange={handleChange} publicBasePath="/completed-projects" />;
}
