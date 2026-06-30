import { ProjectsCatalog } from "@/components/site/ProjectsCatalog";
import { getPublicProjects } from "@/lib/public-projects";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectsPage() {
  const projects = await getPublicProjects();
  return <ProjectsCatalog initialProjects={projects as any[]} />;
}
