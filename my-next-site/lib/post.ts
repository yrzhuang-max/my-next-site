// lib/posts.ts
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // 展示用，例如 "October 10, 2026"
  isoDate: string; // sitemap / JSON-LD 使用，格式 YYYY-MM-DD
  content: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "convert-pdf-to-word-without-losing-formatting",
    title: "How to Convert PDF to Word Without Losing Formatting",
    excerpt: "Learn best practices to keep tables, text layout and fonts intact when converting your PDF document to editable DOCX format online.",
    date: "October 10, 2026",
    isoDate: "2026-10-10",
    content: `
<p>PDF files are designed for viewing, not editing. When you need to modify text or tables inside a PDF, converting it to Microsoft Word DOCX is the most common solution. However, many online converters mess up layouts, fonts and tables.</p>
<h2>1. Use Native Text PDFs for Best Results</h2>
<p>A native PDF contains real text. When you copy text from the PDF directly, you will get plain text successfully. These files convert much better than scanned image PDFs.</p>
<h2>2. Tips to Preserve Tables and Layout</h2>
<ul>
<li>Remove unnecessary headers, footers or watermarks before conversion</li>
<li>Simple tables convert better than complex multi-layer tables</li>
<li>Keep fonts standard like Arial, Times New Roman</li>
</ul>
<h2>3. What to expect after PDF to Word conversion</h2>
<p>Most converted documents will require minor manual adjustments. Complex graphics, multi-column layouts and custom fonts may need small edits in Microsoft Word.</p>
<h2>4. Try FileDocSwift PDF to Word Converter</h2>
<p>Upload your PDF and get editable DOCX in seconds. No sign-up required, your files are automatically deleted after processing.</p>
<p><a href="/pdf-to-word/">Go to PDF to Word tool</a></p>
    `
  },
  {
    slug: "scanned-pdf-vs-native-pdf",
    title: "Scanned PDF vs Native PDF: What Is The Difference?",
    excerpt: "Understand the difference between image scanned PDFs and text PDFs, and why scanned files need OCR to become editable Word documents.",
    date: "October 5, 2026",
    isoDate: "2026-10-05",
    content: `
<p>Many users confuse scanned PDFs and native PDFs, and wonder why their file cannot be edited after conversion.</p>
<h2>Native PDF</h2>
<p>Created from Word, Excel or other software. It contains real text characters. Direct copy-paste works. Can convert to DOCX directly.</p>
<h2>Scanned PDF</h2>
<p>Made from photos or scanned paper pages. The whole page is just an image. There is no real text inside. Normal PDF to Word converter cannot extract text unless OCR technology is used.</p>
<h2>Summary</h2>
<p>Check your PDF first: try selecting text. If you cannot highlight text, it is a scanned PDF and requires OCR.</p>
    `
  },
  {
    slug: "safe-upload-pdf-online-converter",
    title: "Is It Safe To Upload PDFs To Online Converters?",
    excerpt: "Security guide for uploading personal or business PDF files to web-based PDF conversion tools, including file deletion and privacy considerations.",
    date: "September 28, 2026",
    isoDate: "2026-09-28",
    content: `
<p>Privacy is the top concern when uploading personal or business PDF files to online conversion websites.</p>
<h2>Key security points to check before upload</h2>
<ul>
<li>Website uses HTTPS encryption</li>
<li>Automatic file deletion after conversion</li>
<li>No permanent storage of your uploaded documents</li>
<li>No requirement to register an account</li>
</ul>
<h2>When you should NOT upload a file</h2>
<p>Avoid uploading PDFs with highly sensitive data such as ID documents, bank statements or confidential commercial contracts, even if the service promises auto-deletion.</p>
<p>FileDocSwift automatically deletes uploaded files after conversion to protect your privacy.</p>
    `
  }
];