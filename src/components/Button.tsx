// Nút 2 phần: chữ + ô mũi tên (mũi tên trượt chéo khi hover)
import Link from 'next/link';
import type { ReactNode } from 'react';

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M4 12 12 4M5.5 4H12v6.5" />
  </svg>
);

export default function Button({ href, variant = 'primary', children }: { href: string; variant?: 'primary' | 'ghost' | 'dark'; children: ReactNode }) {
  return (
    <Link href={href} className={variant === 'primary' ? 'btn' : `btn btn--${variant}`}>
      <span>{children}</span>
      <span className="btn__arrow"><Arrow /><Arrow /></span>
    </Link>
  );
}
