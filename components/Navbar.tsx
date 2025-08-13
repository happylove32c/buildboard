"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, PlusSquare, LayoutDashboard } from "lucide-react"
import { Button } from "./ui/button"
import { useState, Fragment } from "react"
import { useAuth } from "@/context/AuthContext"
import AuthModal from "./AuthModal"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const baseLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/new", label: "New", icon: PlusSquare },
  ]

  const navLinks = user
    ? [...baseLinks, { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }]
    : baseLinks

  const renderLinks = (isMobile = false) =>
    navLinks.map(({ href, label, icon: Icon }) => (
      <Link
        key={href}
        href={href}
        className={cn(
          "flex items-center gap-1 transition-colors",
          isMobile ? "flex-col text-xs" : "text-sm font-medium",
          pathname === href ? "text-black" : "text-muted-foreground",
          !isMobile && "hover:text-black"
        )}
      >
        <Icon className={isMobile ? "h-6" : "w-4 h-4"} />
        {!isMobile && label}
      </Link>
    ))

  return (
    <Fragment>
      {/* Desktop Navbar */}
      <nav className="hidden sm:flex fixed top-0 z-50 w-full border-b bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between max-w-6xl mx-auto w-full">
          <Link href="/" className="text-xl font-bold text-black">
            Buildboard
          </Link>

          <div className="flex items-center gap-6">
            {renderLinks(false)}
            {user ? (
              <Button onClick={logout}>Logout</Button>
            ) : (
              <Button onClick={() => setOpen(true)}>Sign In</Button>
            )}
          </div>
        </div>
      </nav>

      <div className="hidden sm:block h-[64px]" />

      {/* Mobile Navbar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-inner z-50">
        <div className="flex justify-around py-2">{renderLinks(true)}</div>
      </nav>

      {/* Auth Modal */}
      <AuthModal open={open} setOpen={setOpen} />
    </Fragment>
  )
}