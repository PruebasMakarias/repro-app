import "./globals.css"
import Link from "next/link"

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-100">

        {/* Navbar */}
        <nav className="bg-white shadow-md p-4 flex justify-between">
          <h1 className="font-bold text-lg">Repro App</h1>
          <div className="flex gap-4">
            <Link href="/">Nuevo presupuesto</Link>
            <Link href="/historico">Histórico</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </nav>

        <main className="p-6">{children}</main>

      </body>
    </html>
  )
}
