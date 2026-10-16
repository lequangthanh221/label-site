'use client';
// Nút "Lên đầu trang": hiện sau khi cuộn quá 1 màn hình, vòng ngoài cho biết đã đọc bao nhiêu phần trang.
import { useEffect, useState } from 'react';

const R = 30;
const C = 2 * Math.PI * R;

export default function ScrollTop() {
  const [on, setOn] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setOn(window.scrollY > window.innerHeight * 0.8);
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <button className={`to-top${on ? ' is-on' : ''}`} onClick={goTop} aria-label="Lên đầu trang" tabIndex={on ? 0 : -1}>
      <svg className="to-top__ring" viewBox="0 0 64 64" aria-hidden="true">
        <circle className="to-top__track" cx="32" cy="32" r={R} />
        <circle className="to-top__bar" cx="32" cy="32" r={R} strokeDasharray={C} strokeDashoffset={C * (1 - progress)} />
      </svg>
      <svg className="to-top__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M6 11l6-6 6 6" />
      </svg>
    </button>
  );
}
