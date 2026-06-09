import Navbar from "@/components/common/Navbar"
import Footer from "@/components/common/Footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="page-enter">{children}</main>
      <Footer />
    </>
  )
}
