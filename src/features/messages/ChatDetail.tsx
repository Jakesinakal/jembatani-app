/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';
import {
  ChevronLeft,
  Phone,
  MoreVertical,
  Paperclip,
  Send,
  Camera,
  Check,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { QUICK_REPLIES } from '@/lib/constants';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { useChatDetail } from './useChatDetail';
import { OfferSheet } from './OfferSheet';
import type { OfferSeed } from './useStartChat';

export default function ChatDetail() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const timelineEndRef = useRef<HTMLDivElement>(null);

  const { chat, loading, sendMessage, acceptNegotiation, counterOffer, createNegotiation } =
    useChatDetail(chatId);

  // Product context passed in when the user tapped "Tawar/Penuhi" on a post.
  const offerSeed = (location.state as { offerSeed?: OfferSeed } | null)?.offerSeed;

  const [inputText, setInputText] = useState('');
  const [manualMode, setManualMode] = useState<'create' | 'counter' | null>(null);
  const [autoCreateDismissed, setAutoCreateDismissed] = useState(false);

  // Scroll to bottom whenever the message list changes.
  useEffect(() => {
    timelineEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  // Which sheet to show, derived during render (no setState-in-effect): if we
  // arrived from a post's "Tawar/Penuhi" button and there's no active negotiation
  // yet, default to the create form; a manual action or dismissal overrides it.
  const autoCreate = !!offerSeed && !!chat && !chat.hasActiveNegotiation && !autoCreateDismissed;
  const sheetMode = manualMode ?? (autoCreate ? 'create' : null);
  const closeSheet = () => {
    setManualMode(null);
    setAutoCreateDismissed(true);
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    sendMessage(text);
    setInputText('');
  };

  const handleAcceptNegotiation = () => {
    if (window.confirm('Setujui penawaran ini? Pesanan resmi akan dibuat.')) {
      acceptNegotiation();
    }
  };

  const handleTawarBalik = () => setManualMode('counter');

  const handleSheetSubmit = ({ quantity, price }: { quantity: string; price: number }) => {
    if (sheetMode === 'create' && offerSeed) {
      createNegotiation({
        productName: offerSeed.productName,
        productPhoto: offerSeed.productPhoto,
        quantity,
        originalPrice: offerSeed.originalPrice,
        offerPrice: price,
      });
    } else if (sheetMode === 'counter') {
      counterOffer(price);
    }
    closeSheet();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-full bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-full bg-surface gap-4 px-8 text-center">
        <p className="font-jakarta text-body-md text-on-surface-variant">Chat tidak ditemukan.</p>
        <Button onClick={() => navigate(ROUTES.PESAN)} variant="secondary" size="sm">
          Kembali ke Pesan
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-full bg-surface text-on-surface relative">
      {/* Stick Header row */}
      <div className="sticky top-0 bg-surface-container-highest/95 backdrop-blur-md z-30 px-5 py-4 flex items-center justify-between border-b border-outline-variant/60">
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <button
            onClick={() => navigate(ROUTES.PESAN)}
            className="p-1.5 hover:bg-surface-container rounded-full text-primary active:scale-95 transition-all shrink-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <Avatar
            src={chat.partnerAvatar}
            name={chat.partnerName}
            size="md"
            isVerified={chat.partnerVerified}
          />

          <div className="min-w-0">
            <div className="flex items-center gap-0.5">
              <span className="font-jakarta font-bold text-body-sm text-on-surface leading-tight truncate">
                {chat.partnerName}
              </span>
              {chat.partnerVerified && <VerifiedBadge size="xs" />}
            </div>
            <span className="text-body-sm text-primary font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-surface-tint rounded-full inline-block animate-pulse" />{' '}
              Aktif Sekarang
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert(`Telepon WhatsApp ke ${chat.partnerName}...`)}
            className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant active:scale-90"
          >
            <Phone strokeWidth={1.5} className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant">
            <MoreVertical strokeWidth={1.5} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Pinned Negotiation Card Row */}
      {chat.hasActiveNegotiation && chat.negotiationInfo && (
        <div className="bg-tertiary-fixed/40 border-b border-outline-variant p-4 px-5 flex flex-col gap-3 z-20">
          <div className="flex items-start gap-3">
            <img
              src={chat.negotiationInfo.productPhoto}
              alt={chat.negotiationInfo.productName}
              className="w-12 h-12 rounded object-cover border border-outline-variant"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-body-sm bg-tertiary-fixed text-on-tertiary-fixed-variant font-extrabold font-jakarta px-2 py-0.5 rounded uppercase tracking-wider block w-max mb-1">
                Aktivitas Tawar-Menawar
              </span>
              <h4 className="font-fraunces font-bold text-body-sm text-primary leading-tight">
                {chat.negotiationInfo.productName}
              </h4>
              <p className="font-jakarta text-body-sm text-on-surface-variant mt-0.5">
                Jumlah: <b className="font-bold">{chat.negotiationInfo.quantity}</b> · Ajuan
                Terakhir:{' '}
                <b className="font-bold text-secondary font-fraunces tabular-nums">
                  {formatRupiah(chat.negotiationInfo.lastPriceOffer)}
                </b>
                /kg
              </p>
            </div>
          </div>

          <div className="flex gap-2 items-center justify-end">
            <button
              onClick={handleTawarBalik}
              className="px-3.5 py-1.5 border border-outline text-primary font-bold text-label-md bg-surface-container-lowest hover:bg-surface-container rounded-lg active:scale-95 transition-all"
            >
              Tawar Balik
            </button>
            <Button
              onClick={handleAcceptNegotiation}
              variant="primary"
              size="sm"
              className="py-1.5 px-4 font-bold rounded-lg flex items-center gap-1 text-label-md shadow-sm"
            >
              <Check className="w-3.5 h-3.5" /> Setujui
            </Button>
          </div>
        </div>
      )}

      {/* Chat Timeline (Timeline layout wraps the entire scrolling area) */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-48">
        {chat.messages.map((msg) => {
          const isMe = msg.sender === 'ME';
          const isSystem = msg.text.startsWith('🤝') || msg.text.startsWith('🤝 NEGOSIASI');

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-6">
                <div className="bg-primary-fixed border border-on-primary-fixed-variant/30 p-4 rounded-lg max-w-[85%] text-center shadow-sm">
                  <div className="flex justify-center mb-1">
                    <ShieldCheck className="w-6 h-6 text-on-primary-fixed" />
                  </div>
                  <p className="font-jakarta text-body-sm text-on-primary-fixed font-bold leading-relaxed">
                    {msg.text}
                  </p>
                  <span className="text-body-sm font-jakarta text-on-primary-fixed/60 block mt-1.5">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[78%] p-3.5 rounded-lg text-body-sm leading-relaxed ${
                  isMe
                    ? 'bg-primary text-on-primary rounded-br-none font-jakarta font-medium shadow-sm'
                    : 'bg-surface-container-lowest text-on-surface border border-outline-variant/60 rounded-bl-none font-jakarta font-medium shadow-2xs'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`text-body-sm font-jakarta block text-right mt-1.5 ${
                    isMe ? 'text-on-primary-container/70' : 'text-on-surface-variant'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={timelineEndRef} />
      </div>

      {/* Pinned Input Accessory row with quick replies and bottom bars */}
      <div className="absolute bottom-0 inset-x-0 bg-surface border-t border-outline-variant/60 p-4 pt-3 pb-24 z-20">
        {/* Quick Replies chips row */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              onClick={() => handleSendMessage(reply)}
              className="px-3.5 py-1.5 bg-surface-container border border-outline-variant text-body-sm font-bold font-jakarta rounded-full text-on-surface-variant hover:border-primary active:scale-95 transition-all shrink-0 whitespace-nowrap"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Text Form bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Lampiran file: Lampirkan foto panen/lahan (katalog baru)')}
            className="p-2.5 bg-surface-container hover:bg-surface-container-high rounded-full text-on-surface-variant active:scale-95 transition-transform"
          >
            <Paperclip strokeWidth={1.5} className="w-5 h-5" />
          </button>

          <div className="flex-1 bg-surface-container-low border border-outline-variant rounded-full px-4 py-2 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              placeholder="Tulis pesan negosiasi..."
              className="flex-1 bg-transparent border-none outline-none text-body-sm font-jakarta text-on-surface placeholder-on-surface-variant/70"
            />
            <button
              onClick={() => alert('Mengaktifkan kamera untuk foto panen...')}
              className="text-on-surface-variant hover:text-primary active:scale-95"
            >
              <Camera strokeWidth={1.5} className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim()}
            className={`p-3 rounded-full flex items-center justify-center transition-all ${
              inputText.trim()
                ? 'bg-primary text-on-primary shadow shadow-primary'
                : 'bg-surface-container text-on-surface-variant/40'
            }`}
          >
            <Send className="w-4 h-4 translate-x-px -translate-y-px" />
          </button>
        </div>
      </div>

      {/* Offer / counter-offer bottom sheet */}
      {sheetMode === 'create' && offerSeed && (
        <OfferSheet
          open
          onClose={closeSheet}
          title="Ajukan Penawaran"
          productName={offerSeed.productName}
          productPhoto={offerSeed.productPhoto}
          originalPrice={offerSeed.originalPrice}
          initialQuantity={offerSeed.defaultQuantity}
          initialPrice={offerSeed.originalPrice}
          quantityEditable
          submitLabel="Kirim Penawaran"
          onSubmit={handleSheetSubmit}
        />
      )}
      {sheetMode === 'counter' && chat.negotiationInfo && (
        <OfferSheet
          open
          onClose={closeSheet}
          title="Tawar Balik"
          productName={chat.negotiationInfo.productName}
          productPhoto={chat.negotiationInfo.productPhoto}
          originalPrice={chat.negotiationInfo.originalPrice}
          initialQuantity={chat.negotiationInfo.quantity}
          initialPrice={chat.negotiationInfo.lastPriceOffer}
          quantityEditable={false}
          submitLabel="Kirim Tawaran Balik"
          onSubmit={handleSheetSubmit}
        />
      )}
    </div>
  );
}
