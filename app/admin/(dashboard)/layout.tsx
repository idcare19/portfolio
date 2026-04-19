import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/auth";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { ToastProvider } from "@/components/admin/ToastProvider";
import { AdminBreadcrumbs } from "@/components/admin/Breadcrumbs";
import { MobileAdminHeader } from "@/components/admin/MobileAdminHeader";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-100 lg:flex">
        <AdminSidebar />
        <div className="min-w-0 flex-1 p-3 sm:p-4 md:p-6">
          <MobileAdminHeader />
          <div className="mb-4 flex items-center justify-end">
            <LogoutButton />
          </div>
          <AdminBreadcrumbs />
          {children}
        </div>
      </div>
    </ToastProvider>
  );
}
