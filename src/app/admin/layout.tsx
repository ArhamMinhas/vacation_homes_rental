export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-enter min-h-screen bg-muted/30">
      {children}
    </div>
  )
}
