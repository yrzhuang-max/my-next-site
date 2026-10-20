'use client';
import Link from "next/link";
import Container from "./Container";
import { useState, useEffect } from 'react';

export default function Footer() {
  const [year, setYear] = useState('');

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  const openCookieModal = (e: React.MouseEvent) => {
    e.preventDefault();
    (window as any).openCookieConsentModal?.();
  };

  return (
    <footer className="border-t border-gray-200 mt-16 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="font-semibold text-gray-800">filedocswift.com</p>
            <p className="text-sm text-gray-500">Online document converter tools</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
            <Link href="/pdf-to-word" className="text-gray-600 hover:text-blue-600">PDF to Word</Link>
            <Link href="/blog" className="text-gray-600 hover:text-blue-600">Blog</Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600">About</Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <Link href="/legal/privacy-policy" className="hover:text-blue-600">Privacy Policy</Link>
          <Link href="/legal/terms-of-service" className="hover:text-blue-600">Terms of Service</Link>
          <Link href="/legal/cookie-policy" className="hover:text-blue-600">Cookie Policy</Link>
          <a href="#" onClick={openCookieModal} className="hover:text-blue-400">
            Cookie Settings
          </a>
        </div>
        <p className="text-sm text-gray-500 mt-4 text-center">
          © {year} filedocswift.com. All rights reserved.
        </p>
      </div>
    </footer>
  );
}