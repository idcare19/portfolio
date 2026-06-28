import { revalidatePath } from "next/cache";

const DEFAULT_REVALIDATE_PATHS = ["/", "/maintenance"];

export function revalidateSitePaths(paths: string[] = DEFAULT_REVALIDATE_PATHS) {
  for (const path of paths) {
    revalidatePath(path);
  }
}
