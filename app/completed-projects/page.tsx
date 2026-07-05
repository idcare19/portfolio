import { ProjectsCatalog } from "@/components/site/ProjectsCatalog";
import { getPublicCompletedProjects } from "@/lib/completed-projects";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CompletedProjectsPage() {
  const projects = await getPublicCompletedProjects();
  return <ProjectsCatalog initialProjects={projects as any[]} />;
}
