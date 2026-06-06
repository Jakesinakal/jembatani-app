import React, { useRef, useState } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';

export interface PhotoUploadSectionProps {
  uploadedPhotos: string[];
  setUploadedPhotos: (photos: string[]) => void;
}

export function PhotoUploadSection({ uploadedPhotos, setUploadedPhotos }: PhotoUploadSectionProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setUploadError('');

    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { url, error } = await uploadImage('post-images', file, path);
    setUploading(false);

    if (error || !url) {
      setUploadError(error ?? 'Gagal mengunggah foto.');
      return;
    }

    setUploadedPhotos([...uploadedPhotos, url]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="text-label-md font-bold text-on-surface uppercase tracking-wider block font-jakarta">
        Foto Hasil Panen / Produk (Batas 3)
      </label>

      {uploadError && <p className="text-body-sm text-error font-semibold">{uploadError}</p>}

      <div className="grid grid-cols-3 gap-2.5">
        {uploadedPhotos.map((url, idx) => (
          <div
            key={idx}
            className="relative aspect-square rounded-lg overflow-hidden border border-outline-variant"
          >
            <img
              src={url}
              alt="uploaded crop"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <button
              type="button"
              onClick={() => setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== idx))}
              className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full text-white text-body-sm flex items-center justify-center font-bold"
            >
              ×
            </button>
          </div>
        ))}

        {uploadedPhotos.length < 3 && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="aspect-square rounded-lg border-2 border-dashed border-outline-variant hover:border-primary bg-surface-container-low flex flex-col items-center justify-center text-center p-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              ) : (
                <>
                  <UploadCloud className="w-6 h-6 text-on-surface-variant/70 mb-1" />
                  <span className="text-[9px] font-bold text-on-surface-variant font-jakarta uppercase">
                    TAMBAHKAN FOTO
                  </span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
