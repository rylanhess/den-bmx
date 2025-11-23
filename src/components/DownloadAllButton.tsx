'use client';

import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';

interface DownloadAllButtonProps {
  files: Array<{ file: string; name: string }>;
}

export default function DownloadAllButton({ files }: DownloadAllButtonProps) {
  const handleDownloadAll = async () => {
    for (let i = 0; i < files.length; i++) {
      const template = files[i];
      const link = document.createElement('a');
      link.href = template.file;
      link.download = template.file.split('/').pop() || template.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Delay between downloads to avoid browser blocking
      if (i < files.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <button
        onClick={handleDownloadAll}
        className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-[#00ff0c] hover:bg-white text-black font-black py-4 px-8 border-4 border-black transition-all transform hover:scale-105 text-xl"
      >
        <ArrowDownTrayIcon className="w-6 h-6" />
        <span className="font-black">DOWNLOAD ALL FILES</span>
        <span className="text-lg">({files.length} {files.length === 1 ? 'file' : 'files'})</span>
      </button>
    </div>
  );
}

