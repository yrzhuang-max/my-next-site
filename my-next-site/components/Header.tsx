"use client";
import Link from "next/link";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Container from "./Container";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "PDF to Word", href: "/pdf-to-word/" },
    { label: "Blog", href: "/blog/" },
    { label: "About", href: "/about/" },
    { label: "Contact", href: "/contact/" },
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
          <nav className="hidden md:flex gap-6">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-slate-700 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
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
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}