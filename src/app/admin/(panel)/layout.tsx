import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in-up">
          {children}
        </div>
      </main>
    </div>
  )
}
