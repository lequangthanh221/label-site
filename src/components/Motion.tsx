'use client';
// Chuyển động dùng chung - chạy lại mỗi lần đổi trang.
// [data-reveal]          hiện dần từ mờ khi cuộn tới (data-delay = ms)
// [data-reveal="words"]  từng chữ (<Words>) hiện lần lượt
// [data-count]           đếm số khi cuộn tới
// [data-parallax]        trôi theo cuộn (giá trị = hệ số, vd 0.15)
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups: (() => void)[] = [];

    document.querySelectorAll<HTMLElement>('[data-delay]').forEach((el) => el.style.setProperty('--d', el.dataset.delay!));

    const revealIO = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); revealIO.unobserve(e.target); }
      }),
      { rootMargin: '0px 0px -12% 0px' },
    );
    document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => revealIO.observe(el));
    cleanups.push(() => revealIO.disconnect());

    const countIO = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      countIO.unobserve(e.target);
      const el = e.target as HTMLElement;
      const end = Number(el.dataset.count);
      if (reduce) { el.textContent = end.toLocaleString('vi-VN'); return; }
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 1600);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4))).toLocaleString('vi-VN');
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0';
      requestAnimationFrame(tick);
    }), { threshold: 0.6 });
    document.querySelectorAll('[data-count]').forEach((el) => countIO.observe(el));
    cleanups.push(() => countIO.disconnect());

    const parallax = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
    if (parallax.length && !reduce) {
      let ticking = false;
      const update = () => {
        const vh = window.innerHeight;
        parallax.forEach((el) => {
          const r = el.parentElement!.getBoundingClientRect();
          el.style.transform = `translate3d(0, ${((r.top + r.height / 2 - vh / 2) * Number(el.dataset.parallax)).toFixed(1)}px, 0)`;
        });
        ticking = false;
      };
      const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
      window.addEventListener('scroll', onScroll, { passive: true });
      update();
      cleanups.push(() => window.removeEventListener('scroll', onScroll));
    }

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
