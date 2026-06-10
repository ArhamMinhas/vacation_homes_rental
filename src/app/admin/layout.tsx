import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30 lg:flex">
      <AdminSidebar />
      {/* pt-14 on mobile accounts for the fixed top header; removed on lg */}
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 overflow-auto">
        <div className="p-4 sm:p-6 animate-fade-in-up">
          {children}
        </div>
      </main>
    </div>
  )
}
