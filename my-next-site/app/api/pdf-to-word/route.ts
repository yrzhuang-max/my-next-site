import { NextRequest, NextResponse } from 'next/server';
import { Document, Packer, Paragraph } from 'docx';

// 单文件上限：10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ success: false, msg: 'No file uploaded' }, { status: 400 });
    }

    // 文件大小校验
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, msg: 'File too large. Maximum allowed size is 10MB.' },
        { status: 413 }
      );
    }

    // 简单后缀校验，只允许pdf
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.pdf')) {
      return NextResponse.json(
        { success: false, msg: 'Only PDF files are supported.' },
        { status: 400 }
      );
    }

    const upstreamUrl = process.env.PDF_EXTRACT_API;
    if (!upstreamUrl) {
      return NextResponse.json({ success: false, msg: "Missing PDF_EXTRACT_API environment variable" }, { status: 500 });
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
        success: false,
        msg: "This PDF is made of scanned images. Basic version cannot extract text from scanned PDFs or image tables.",
        isFullScan: true
      }, { status: 400 });
    }
    if (json.error || !json.text) {
      return NextResponse.json({
        success: false,
        msg: "PDF extract failed, file may be encrypted or corrupted."
      }, { status: 400 });
    }

    const rawText: string = json.text;
    const lines = rawText.split(/\r?\n/).filter((l: string) => l.trim());
    const paragraphs = lines.map((line: string) => new Paragraph(line));
    const doc = new Document({
      sections: [{ children: paragraphs }]
    });
    const outBuf = await Packer.toBuffer(doc);

    const downloadName = file.name.replace(/\.pdf$/i, '') + ".docx";

    return new NextResponse(outBuf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${downloadName}"`,
        "X-Warning-Message": "Some parts of this PDF are scanned images or image tables. These cannot be converted in Basic version."
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, msg: 'Convert failed, file may be encrypted or corrupted' },
      { status: 500 }
    );
  }
}

// 跨域预检
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "https://filedocswift.com",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}