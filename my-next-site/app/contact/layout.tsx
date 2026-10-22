import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | FileDocSwift",
  description: "Get in touch with FileDocSwift team for support and questions about our PDF conversion tools.",
  alternates: {
    canonical: "https://www.filedocswift.com/contact/"
  }
};

export default function ContactLayout({children}:{children:React.ReactNode}){
  return children;
}