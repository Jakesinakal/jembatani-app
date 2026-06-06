/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PostType } from '@/types/post';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/routes';
import { PageHeader } from '@/components/layout/PageHeader';
import { PhotoUploadSection } from '@/features/feed/create/PhotoUploadSection';
import { CommoditySection } from '@/features/feed/create/CommoditySection';
import { GradeConditionSection } from '@/features/feed/create/GradeConditionSection';
import { PricingSection } from '@/features/feed/create/PricingSection';
import { B2BToggleSection } from '@/features/feed/create/B2BToggleSection';
import { LocationDateSection } from '@/features/feed/create/LocationDateSection';
import { DescriptionCertSection } from '@/features/feed/create/DescriptionCertSection';

export interface CreateListingProps {
  refetchPosts: () => void;
}

export default function CreateListing({ refetchPosts }: CreateListingProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const listingType = (searchParams.get('type') || 'penawaran').toUpperCase() as PostType;

  const [commodity, setCommodity] = useState('Cabai Merah');
  const [customTitle, setCustomTitle] = useState('');
  const [grade, setGrade] = useState<'A' | 'B' | 'C'>('A');
  const [condition, setCondition] = useState<'Segar' | 'Kering' | 'Olahan'>('Segar');
  const [unit, setUnit] = useState('kg');
  const [stock, setStock] = useState('500');
  const [price, setPrice] = useState('32000');
  const [isRetail, setIsRetail] = useState(true);
  const [isB2B, setIsB2B] = useState(true);
  const [minRetail, setMinRetail] = useState('1 kg');
  const [minB2B, setMinB2B] = useState('50 kg');
  const [location, setLocation] = useState('Kabupaten Garut, Jawa Barat');
  const [date, setDate] = useState('30 Mei 2026');
  const [desc, setDesc] = useState('');
  const [selectedCerts, setSelectedCerts] = useState<string[]>(['ORGANIK']);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commodity || !stock || !price || !desc) {
      setErrorMsg('Harap lengkapi isian wajib: Komoditas, Stok, Harga, dan Deskripsi!');
      return;
    }
    if (!user) return;

    const finalTitle =
      customTitle ||
      `${commodity} ${listingType === 'PENAWARAN' ? 'Siap Panen' : 'Butuh Cepat'} Grade ${grade}`;

    setIsSubmitting(true);
    setErrorMsg('');

    const { error } = await supabase.from('posts').insert({
      user_id: user.id,
      type: listingType,
      title: finalTitle,
      price: parseInt(price),
      unit,
      min_order_retail: isRetail ? minRetail : null,
      min_order_b2b: isB2B ? minB2B : null,
      stock_available: listingType === 'PENAWARAN' ? `${stock} ${unit}` : null,
      quantity_needed: listingType === 'PERMINTAAN' ? `${stock} ${unit}` : null,
      photo_url: uploadedPhotos[0] || '',
      location,
      harvest_or_needed_date: date,
      certifications: selectedCerts,
      caption: desc,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMsg('Gagal menerbitkan: ' + error.message);
      return;
    }

    refetchPosts();
    navigate(ROUTES.BERANDA);
  };

  return (
    <div className="flex-1 pb-28 bg-surface text-on-surface">
      <PageHeader
        title={`Buat ${listingType === 'PENAWARAN' ? 'Penawaran' : 'Permintaan'}`}
        onBack={() => navigate(ROUTES.BERANDA)}
      />

      <form onSubmit={handlePublish} className="px-5 mt-6 space-y-6">
        {errorMsg && (
          <div className="text-error bg-error-container/20 border border-error-container p-3 rounded-lg text-body-sm font-semibold">
            {errorMsg}
          </div>
        )}
        <PhotoUploadSection uploadedPhotos={uploadedPhotos} setUploadedPhotos={setUploadedPhotos} />
        <CommoditySection
          commodity={commodity}
          setCommodity={setCommodity}
          customTitle={customTitle}
          setCustomTitle={setCustomTitle}
        />
        <GradeConditionSection
          grade={grade}
          setGrade={setGrade}
          condition={condition}
          setCondition={setCondition}
        />
        <PricingSection
          unit={unit}
          setUnit={setUnit}
          stock={stock}
          setStock={setStock}
          price={price}
          setPrice={setPrice}
          listingType={listingType}
        />
        <B2BToggleSection
          isRetail={isRetail}
          setIsRetail={setIsRetail}
          minRetail={minRetail}
          setMinRetail={setMinRetail}
          isB2B={isB2B}
          setIsB2B={setIsB2B}
          minB2B={minB2B}
          setMinB2B={setMinB2B}
        />
        <LocationDateSection
          location={location}
          setLocation={setLocation}
          date={date}
          setDate={setDate}
        />
        <DescriptionCertSection
          desc={desc}
          setDesc={setDesc}
          selectedCerts={selectedCerts}
          setSelectedCerts={setSelectedCerts}
        />

        <div className="pt-4">
          <Button
            id="publish-submit-btn"
            type="submit"
            variant="primary"
            fullWidth
            className="py-4 shadow-lg text-body-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Memposting...
              </span>
            ) : (
              'Posting Sekarang'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
