import Navbar from "@/components/common/Navbar"
import Footer from "@/components/common/Footer"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="page-enter min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
