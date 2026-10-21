'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import Button from '@/components/Button';
import FileUpload from '@/components/FileUpload';

export default function PremiumPanel() {
  const [premiumFile, setPremiumFile] = useState<File | null>(null);

  return (
    <Card className="border-blue-400">
      <CardHeader>
        <CardTitle className="text-lg">Premium Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="text-sm text-gray-600 space-y-1">
          <p>✅ Large file uploads (up to 50MB)</p>
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

        <div className="pt-2">
          <Button disabled className="w-full">Convert to Editable Text</Button>
        </div>
      </CardContent>
    </Card>
  );
}
