/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { formatRupiah, formatRelativeTime } from '@/lib/utils';
import { Post } from '@/types/post';

export interface PostCardProps {
  post: Post;
  onLikePost: (postId: string) => void;
  onContact: () => void;
  onMakeOffer: () => void;
}

export function PostCard({ post, onLikePost, onContact, onMakeOffer }: PostCardProps) {
  const isPenawaran = post.type === 'PENAWARAN';

  return (
    <div
      key={post.id}
      id={`feed-post-${post.id}`}
      className="bg-surface-container-lowest rounded-lg border border-outline-variant/60 overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col transition-all active:scale-[0.99]"
    >
      {/* Author Info row */}
      <div className="p-4 py-3 flex items-center justify-between border-b border-outline-variant/30">
        <div className="flex items-center gap-2.5">
          <Avatar
            src={post.author.avatar}
            name={post.author.name}
            size="sm"
            isVerified={post.author.isVerified}
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="font-jakarta font-bold text-label-md text-on-surface">
                {post.author.name}
              </span>
              {post.author.isVerified && <VerifiedBadge size="sm" />}
            </div>
            <span className="text-body-sm text-on-surface-variant font-medium flex items-center gap-0.5">
              📍 {post.author.location}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-body-sm font-jakarta text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
            {formatRelativeTime(post.hoursAgo)}
          </span>
        </div>
      </div>

      {/* Hero Photo Block (4:3 aspect ratio) */}
      <div className="relative aspect-[4/3] w-full bg-surface-container overflow-hidden">
        <img
          src={post.photoUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Floating Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
          <Badge variant={isPenawaran ? 'penawaran' : 'permintaan'}>{post.type}</Badge>
          {post.certifications.map((cert) => (
            <Badge
              key={cert}
              variant="organic"
              className="bg-surface-container-lowest/85 backdrop-blur-md"
            >
              {cert}
            </Badge>
          ))}
        </div>

        {/* Stock banner overlays */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 flex justify-between items-end">
          <div className="text-inverse-on-surface">
            <span className="text-body-sm text-inverse-on-surface/70 block uppercase font-bold tracking-wider mb-0.5">
              {isPenawaran ? 'Persediaan' : 'Kapasitas Butuh'}
            </span>
            <span className="font-jakarta font-bold text-body-sm">
              {isPenawaran ? post.stockAvailable : post.quantityNeeded}
            </span>
          </div>
          <div className="text-right text-inverse-on-surface">
            <span className="text-body-sm text-inverse-on-surface/70 block uppercase font-bold tracking-wider mb-0.5">
              Siap Kirim / Panen
            </span>
            <span className="font-jakarta font-bold text-body-sm">{post.harvestOrNeededDate}</span>
          </div>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-6">
        <h3
          onClick={() => alert(`Sajian Detail: ${post.title}`)}
          className="font-fraunces text-body-lg font-bold text-primary leading-snug tracking-tight mb-2 hover:text-secondary cursor-pointer"
        >
          {post.title}
        </h3>
        <p className="font-jakarta text-body-sm text-on-surface-variant mb-4 leading-relaxed line-clamp-2">
          {post.caption}
        </p>

        <div className="border-t border-outline-variant/40 pt-4 flex items-center justify-between">
          <div>
            <span className="text-body-sm text-on-surface-variant font-bold uppercase tracking-wider block font-jakarta">
              Harga Tertera
            </span>
            <span className="text-headline-md font-fraunces font-bold text-secondary tracking-tight tabular-nums">
              {formatRupiah(post.price)}
              <span className="font-jakarta text-body-sm font-semibold text-on-surface-variant">
                /{post.unit}
              </span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-body-sm text-on-surface-variant font-bold uppercase tracking-wider block font-jakarta">
              Min. Order
            </span>
            <span className="font-jakarta text-label-md font-bold text-primary">
              {isPenawaran ? `Retail: ${post.minOrderRetail}` : `Grosir: ${post.minOrderB2B}`}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action bar */}
      <div className="p-4 py-3 bg-surface-container-low border-t border-outline-variant/40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLikePost(post.id)}
            className={`flex items-center gap-1.5 text-label-md font-semibold font-jakarta active:scale-90 transition-transform ${
              post.isLiked ? 'text-secondary font-bold' : 'text-on-surface-variant'
            }`}
          >
            <Heart
              strokeWidth={1.5}
              className={`w-5 h-5 ${post.isLiked ? 'fill-secondary text-secondary' : 'text-on-surface-variant'}`}
            />
            <span>{post.likesCount}</span>
          </button>

          <button
            onClick={onContact}
            className="flex items-center gap-1.5 text-label-md font-semibold text-on-surface-variant font-jakarta hover:text-primary"
          >
            <MessageCircle strokeWidth={1.5} className="w-5 h-5" />
            <span>{post.commentsCount}</span>
          </button>

          <button
            onClick={() => alert('Link dibagikan ke WhatsApp!')}
            className="text-on-surface-variant p-1 hover:text-primary active:scale-95 transition-transform"
          >
            <Share2 strokeWidth={1.5} className="w-4.5 h-4.5" />
          </button>
        </div>

        <Button
          id={`post-cta-${post.id}`}
          variant={isPenawaran ? 'secondary' : 'primary'}
          size="sm"
          onClick={onMakeOffer}
          className="shadow-sm py-1.5 px-4 font-bold"
        >
          {isPenawaran ? 'Tawar' : 'Penuhi'}
        </Button>
      </div>
    </div>
  );
}
