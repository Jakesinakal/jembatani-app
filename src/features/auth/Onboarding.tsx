/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/Button';

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Jual Hasil Panen Langsung ke Pembeli',
      desc: 'Pangkas tengkulak, dapatkan untung lebih besar dengan terhubung langsung ke restoran, katering, dan grosir besar di perkotaan.',
      image:
        'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'Cari Komoditas Terbaik dari Sumbernya',
      desc: 'Dapatkan pasokan hasil bumi segar dengan kualitas terjamin dan sertifikasi terverifikasi langsung dari kelompok tani terpercaya.',
      image:
        'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'Pantau Harga Komoditas Real-Time',
      desc: 'Gunakan referensi harga harian dari berbagai wilayah Jawa Barat untuk negosiasi yang adil dan keputusan jual-beli yang pintar.',
      image:
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  const handleSkip = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="flex-1 flex flex-col justify-between min-h-full bg-surface relative overflow-hidden">
      {/* Background Image Carousel with Fade Animation */}
      <div className="absolute inset-0 w-full h-[60%] z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/40 to-surface z-10" />
            <img
              src={slides[currentSlide].image}
              alt="onboarding illustration"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Top action row */}
      <div className="flex justify-between items-center px-5 pt-8 z-20">
        <span className="font-fraunces text-body-lg font-bold text-primary">JembaTani</span>
        {currentSlide < slides.length - 1 && (
          <button
            onClick={handleSkip}
            className="text-label-md text-on-surface-variant font-semibold px-3 py-1 bg-surface-container/60 backdrop-blur-md rounded-full"
          >
            Lewat
          </button>
        )}
      </div>

      {/* Content Card area */}
      <div className="bg-surface px-6 pt-12 pb-8 rounded-t-xl shadow-[0_-8px_30px_rgb(0,0,0,0.06)] flex flex-col z-20">
        {/* Pagination indicator dots */}
        <div className="flex gap-1.5 mb-6 justify-center">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-8 bg-primary' : 'w-1.5 bg-outline-variant'
              }`}
            />
          ))}
        </div>

        {/* Text Content */}
        <div className="min-h-[140px] text-center mb-8">
          <h2 className="font-fraunces text-headline-md font-bold text-primary mb-4 tracking-tight leading-8">
            {slides[currentSlide].title}
          </h2>
          <p className="font-jakarta text-body-md text-on-surface-variant leading-relaxed">
            {slides[currentSlide].desc}
          </p>
        </div>

        {/* Navigation Action CTA */}
        <div className="flex items-center justify-between">
          <span></span> {/* Spacer for alignment */}
          <Button
            id="onboarding-next-btn"
            variant={currentSlide === slides.length - 1 ? 'secondary' : 'primary'}
            onClick={handleNext}
            className="flex items-center gap-2 group shadow-md"
          >
            {currentSlide === slides.length - 1 ? (
              <>
                Mulai Sekarang <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                Lanjut{' '}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
