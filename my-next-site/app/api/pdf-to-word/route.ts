import { NextRequest, NextResponse } from 'next/server';
import { Document, Packer, Paragraph } from 'docx';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    const upstreamUrl = process.env.PDF_EXTRACT_API;
    if (!upstreamUrl) {
      return NextResponse.json({ error: "Missing PDF_EXTRACT_API environment variable", status: 500 });
    }

    const upstreamForm = new FormData();
    upstreamForm.append('file', file);
    const res = await fetch(upstreamUrl, {
      method: "POST",
      body: upstreamForm
    });
    const json = await res.json();

    if (json.error === "no_text") {
      return NextResponse.json({
        error: "This PDF is made of scanned images. Basic version cannot extract text from scanned PDFs or image tables.",
        isFullScan: true
      }, { status: 400 });
    }
    if (json.error || !json.text) {
      return NextResponse.json({
        error: "PDF extract failed, file may be encrypted or corrupted."
      }, { status: 400 });
    }

    const rawText: string = json.text;
    const lines = rawText.split(/\r?\n/).filter((l: string) => l.trim());
    const paragraphs = lines.map((line: string) => new Paragraph(line));
    const doc = new Document({
      sections: [{ children: paragraphs }]
    });
    const outBuf = await Packer.toBuffer(doc);
    const uint8 = new Uint8Array(outBuf);

    return NextResponse.json(uint8, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${ file.name.replace(/\.pdf$/i, '') }.docx"`,
        // 自定义 header 传递警告信息给前端
        "X-Warning-Message": "Some parts of this PDF are scanned images or image tables. These cannot be converted in Basic version."
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Convert failed, file may be encrypted or corrupted' }, { status: 500 });
  }
}
