import { NextRequest, NextResponse } from 'next/server';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph } from 'docx';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.mjs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const arrayBuf = buf.buffer;

    const pdf = await pdfjsLib.getDocument({ data: arrayBuf }).promise;
    const numPages = pdf.numPages;
    const paragraphs: Paragraph[] = [];
    let hasImage = false;

    outer: for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const ops = await page.getOperatorList();
      for (const op of ops.fnArray) {
        if (op === pdfjsLib.OPS.paintImageXObject || op === pdfjsLib.OPS.paintImageMaskXObject) {
          hasImage = true;
          break outer;
        }
      }
      if (hasImage) break;

      const textContent = await page.getTextContent();
      const text = textContent.items.map((it: any) => it.str).join(' ');
      paragraphs.push(new Paragraph(text));
    }

    if (hasImage) {
      return NextResponse.json({
        error: "This PDF contains images or embedded graphics. Basic version only supports pure text PDFs. Please use Premium."
      }, { status: 400 });
    }

    const doc = new Document({
      sections: [{ children: paragraphs }]
    });
    const outBuf = await Packer.toBuffer(doc);
    // ✅ Buffer → Uint8Array，解决TS类型报错
    const uint8 = new Uint8Array(outBuf);

    return new NextResponse(uint8, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${ file.name.replace(/\.pdf$/i, '') }.docx"`
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Convert failed, file may be encrypted or corrupted' }, { status: 500 });
  }
}
