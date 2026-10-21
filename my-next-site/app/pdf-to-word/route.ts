import { NextRequest, NextResponse } from 'next/server';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph } from 'docx';

// 指定 worker（服务端用本地）
pdfjsLib.GlobalWorkerOptions.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const arrayBuf = buf.buffer;

    // 加载PDF
    const pdf = await pdfjsLib.getDocument({ data: arrayBuf }).promise;
    const numPages = pdf.numPages;
    const paragraphs: Paragraph[] = [];
    let hasImage = false;

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      // 检查是否包含图片
      const ops = await page.getOperatorList();
      for ( const op of ops.fnArray ) {
        if (op === pdfjsLib.OPS.paintImageXObject || op === pdfjsLib.OPS.paintImageMaskXObject) {
          hasImage = true;
          break;
        }
      }
      if (hasImage) break;

      // 提取文本
      const textContent = await page.getTextContent();
      const text = textContent.items.map((it: any) => it.str).join(' ');
      paragraphs.push(new Paragraph(text));
    }

    if (hasImage) {
      return NextResponse.json({
        error: "This PDF contains images or embedded graphics. Basic version only supports pure text PDFs. Please use Premium."
      }, { status: 400 });
    }

    // 生成docx
    const doc = new Document({
      sections: [{ children: paragraphs }]
    });
    const outBuf = await Packer.toBuffer(doc);

    return new NextResponse(outBuf, {
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
