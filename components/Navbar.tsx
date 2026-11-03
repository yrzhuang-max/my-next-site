'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = localStorage.getItem("token");
      if (!token) {
        setUserEmail(null);
        return;
      }
      try {
        const res = await fetch(`${base}/api/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          localStorage.removeItem("token");
          setUserEmail(null);
          return;
        }
        const data = await res.json();
        setUserEmail(data.user.email);
      } catch (err) {
        localStorage.removeItem("token");
        setUserEmail(null);
      }
    };
    checkLogin();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserEmail(null);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "PDF to Word", href: "/pdf-to-word" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-gray-900">
            filedocswift
          </Link>

          {/* 桌面端菜单 */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 桌面端登录按钮组 */}
          <div className="hidden md:flex items-center gap-3">
            {userEmail ? (
              <>
                <span className="text-sm text-gray-500">{userEmail}</span>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* 移动端汉堡按钮 */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* 移动端下拉菜单 */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-3 mt-2 flex flex-col gap-3">
                {userEmail ? (
                  <>
                    <span className="text-sm text-gray-500">{userEmail}</span>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="text-left text-sm text-red-600 hover:text-red-700"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 bg-blue-600 text-white rounded text-sm w-fit hover:bg-blue-700"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
