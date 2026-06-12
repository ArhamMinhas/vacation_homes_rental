import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <AdminSidebar />
      {/* pt-14 offsets the mobile fixed top bar; lg removes it since sidebar is inline */}
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 overflow-x-hidden">
        <div className="p-4 sm:p-5 lg:p-8 animate-fade-in-up max-w-[1400px]">
          {children}
        </div>
      </main>
    </div>
  )
}
