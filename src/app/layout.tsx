import type { Metadata } from "next";
import "./globals.css";
import { ProfileProvider } from "@/components/shared/profile-context";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export const metadata: Metadata = {
  title: "MKT KOL — Quản lý KOL đa profile",
  description: "SaaS quản lý KOL: AI tạo bài, lên lịch, trả lời comment, bot chat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ProfileProvider>
          <Sidebar />
          <Topbar />
          <main className="ml-[240px] pt-[68px] min-h-screen">
            <div className="p-7">{children}</div>
          </main>
        </ProfileProvider>
      </body>
    </html>
  );
}
