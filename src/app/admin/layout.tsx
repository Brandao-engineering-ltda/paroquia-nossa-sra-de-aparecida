import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileSidebar } from "@/components/admin/AdminMobileSidebar";
import { FloatingToolbar } from "@/components/FloatingToolbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div className="hidden md:block">
        <AdminSidebar />
      </div>
      <main className="relative flex-1 overflow-y-auto bg-secondary p-4 sm:p-6 md:p-8">
        <div className="mb-4 md:hidden">
          <AdminMobileSidebar />
        </div>
        <FloatingToolbar />
        {children}
      </main>
    </div>
  );
}
