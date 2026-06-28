import { ProjectsCatalog } from "@/components/site/ProjectsCatalog";
import { getPublishedProjects } from "@/lib/portfolio/repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();
  return <ProjectsCatalog initialProjects={projects as any[]} />;
}
