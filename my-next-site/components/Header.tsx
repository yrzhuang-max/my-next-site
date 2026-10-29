"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Container from "./Container";

const base = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "PDF to Word", href: "/pdf-to-word/" },
    { label: "Blog", href: "/blog/" },
    { label: "About", href: "/about/" },
    { label: "Contact", href: "/contact/" },
  ];

  // 获取登录状态
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${base}/api/auth/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const json = await res.json();
          setUser(json.user);
        } else {
          setUser(null);
        }
      } catch () {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const handleLogout = async () => {
    await fetch(`${base}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setMenuOpen(false);
    router.push("/login");
    router.refresh();
  };

  // 登录相关导航
  const authLinks = !user
    ? [
        { label: "Sign In", href: "/login" },
        { label: "Register", href: "/register" },
      ]
    : [
        { label: user.email, href: "/dashboard" },
      ];

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <Container>
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-blue-600">
            FileDocSwift
          </Link>

          {/* Desktop Navigation md+ */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-slate-700 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="border-l border-slate-200 pl-6 flex items-center gap-4">
              {loading ? (
                <span className="text-slate-400">…</span>
              ) : !user ? (
                <>
                  <Link
                    href="/login"
                    className="text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-slate-600 text-sm">{user.email}</span>
                  <Link
                    href="/dashboard"
                    className="text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200">
            <nav className="flex flex-col gap-3">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-slate-700 hover:text-blue-600"
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-slate-200 pt-3 mt-3 flex flex-col gap-3">
                {loading ? (
                  <span className="text-slate-400">Loading…</span>
                ) : !user ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="text-slate-700 hover:text-blue-600"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMenuOpen(false)}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded w-fit hover:bg-blue-700"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="text-slate-600 text-sm">{user.email}</span>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="text-slate-700 hover:text-blue-600"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-left text-red-500 hover:text-red-600 w-fit"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}