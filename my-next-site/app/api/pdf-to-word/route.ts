import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import { Document, Packer, Paragraph } from 'docx';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrBuf = await file.arrayBuffer();
    const buf = Buffer.from(arrBuf);

    // 解析PDF，提取文本
    const result = await pdf(buf);
    // result.text 就是提取出来的文本，支持中文
    const text = result.text.trim();
    if (!text) {
      return NextResponse.json({ error: "No text found in this PDF. It may be scanned image PDF." }, { status: 400 });
    }

    // 按换行切割成段落
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const paragraphs = lines.map(line => new Paragraph(line));

    const doc = new Document({
      sections: [{ children: paragraphs }]
    });
    const outBuf = await Packer.toBuffer(doc);
    const uint8 = new Uint8Array(outBuf);

    return new NextResponse(uint8, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${ file.name.replace(/\.pdf$/i, '') }.docx"`
      }
    });
  } catch (err: any) {
    console.error('pdf parse error:', err);
    if (err?.message?.includes('encrypted')) {
      return NextResponse.json({ error: "This PDF is password/permission encrypted, cannot extract text." }, { status: 400 });
    }
    return NextResponse.json({ error: 'Convert failed, file may be encrypted or corrupted' }, { status: 500 });
  }
}
