import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Portfolio CMS",
  description: "Secure admin panel for managing portfolio content",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
