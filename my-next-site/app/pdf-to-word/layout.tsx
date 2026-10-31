import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "PDF to Word Converter | FileDocSwift",
  description: "Convert PDF to editable DOCX Word document online for free. Preserve text and layout, no registration required.",
  alternates: {
    canonical: "https://www.filedocswift.com/pdf-to-word"
  }
};
export default function PdfToWordLayout({children}:{children:React.ReactNode}){
  return children;
}