'use client';
import { useState, useCallback, useRef } from 'react';
import Button from './Button';
type UploadStatus = 'idle' | 'dragging' | 'selected' | 'error';
interface FileUploadProps {
  maxSizeMB?: number;
  accept?: string;
  onFileSelect: (file: File | null) => void;
}
export default function FileUpload({
  maxSizeMB = 25,
  accept = 'application/pdf',
  onFileSelect,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const maxBytes = maxSizeMB * 1024 * 1024;
  const validateFile = useCallback((file: File): boolean => {
    setErrorMsg('');
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.pdf')) {
      setErrorMsg('Only PDF files are allowed.');
      return false;
    }
    if (file.size > maxBytes) {
      setErrorMsg(`File exceeds ${maxSizeMB}MB limit. Please compress your PDF.`);
      return false;
    }
    return true;
  }, [maxBytes, maxSizeMB]);
  const handleFile = useCallback((file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      setStatus('selected');
      onFileSelect(file);
    } else {
      setSelectedFile(null);
      setStatus('error');
      onFileSelect(null);
    }
  }, [validateFile, onFileSelect]);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus('dragging');
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus('idle');
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus('idle');
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };
  const openFilePicker = () => {
    inputRef.current?.click();
  };
  const clearFile = () => {
    setSelectedFile(null);
    setStatus('idle');
    setErrorMsg('');
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // 键盘事件：回车/空格唤起文件选择
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openFilePicker();
    }
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="PDF upload area, drag and drop file or click to select"
        aria-describedby="upload-desc upload-error"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFilePicker}
        onKeyDown={handleKeyDown}
        className={`
          border-2 border-dashed rounded-xl p-6 md:p-8 text-center transition-colors
          ${status === 'dragging' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${status === 'error' ? 'border-red-400 bg-red-50' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="opacity-0 absolute w-0 h-0 pointer-events-none"
        />
        {status === 'idle' || status === 'dragging' ? (
          <div className="space-y-3">
            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p id="upload-desc" className="text-gray-700 font-medium">Drag & drop your PDF here</p>
            <p className="text-sm text-gray-500">or</p>
            <Button onClick={openFilePicker}>Select PDF File</Button>
            <p className="text-xs text-gray-500">Max file size: {maxSizeMB} MB</p>
          </div>
        ) : null}
        {status === 'selected' && selectedFile && (
          <div className="space-y-3">
            <svg className="w-12 h-12 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-800 font-medium">File ready</p>
            <p className="text-sm text-gray-600">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <Button variant="outline" onClick={(e) => {
              e.stopPropagation();
              clearFile();
            }}>Remove file</Button>
          </div>
        )}
        {status === 'error' && (
          <div className="space-y-3">
            <svg className="w-12 h-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 01-18 0z" />
            </svg>
            <p id="upload-error" className="text-red-600 font-medium">{errorMsg}</p>
            <Button variant="outline" onClick={(e) => {
              e.stopPropagation();
              openFilePicker();
            }}>Try another file</Button>
          </div>
        )}
      </div>
      {/* 屏幕阅读器实时播报区域 */}
      <div aria-live="polite" className="sr-only">
        {status === 'dragging' && 'File hovering over upload zone, release to upload'}
        {status === 'selected' && `File ${selectedFile?.name} selected, ready for conversion`}
        {status === 'error' && `Error: ${errorMsg}`}
      </div>
    </div>
  );
}