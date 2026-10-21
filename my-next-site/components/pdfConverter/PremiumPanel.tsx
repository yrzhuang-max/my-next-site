'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import Button from '@/components/Button';
import FileUpload from '@/components/FileUpload';

export default function PremiumPanel() {
  const [premiumFile, setPremiumFile] = useState<File | null>(null);

  // ============ 后续高级版state、转换请求、下载全部写在这里 ============

  return (
    <Card className="border-blue-400">
      <CardHeader>
        <CardTitle className="text-lg">Premium Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="text-sm text-gray-600 space-y-1">
          <p>✅ Large file uploads</p>
          <p>✅ OCR for scanned / image PDFs</p>
          <p>✅ Complex multi‑script mixed layout support</p>
          <p>✅ Preserve original layout & alignment</p>
          <p>✅ Batch conversion & faster processing</p>
        </div>

        <FileUpload onFileSelect={setPremiumFile} accept=".pdf" maxSizeMB={50} />

        {premiumFile && (
          <p className="text-sm text-gray-600">
            Selected: {premiumFile.name} ({(premiumFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}

        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-blue-700 text-sm font-medium">Premium feature, unlock after subscription.</p>
          <p className="text-blue-600 text-xs mt-1">Supports scanned PDFs, multi‑language documents and batch jobs.</p>
        </div>

        <Button disabled>Convert to Editable Text</Button>
      </CardContent>
    </Card>
  );
}
