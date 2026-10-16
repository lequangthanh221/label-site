'use client';
// Chuyển động dùng chung - chạy lại mỗi lần đổi trang.
// [data-reveal]          hiện dần khi cuộn tới (data-delay = ms)
// [data-reveal="words"]  từng chữ (<Words>) hiện lần lượt
// [data-count]           đếm số khi cuộn tới
// [data-parallax]        phần tử trôi theo cuộn (giá trị = hệ số, vd 0.15)
// [data-parallax-hero]   nội dung hero trôi chậm và mờ dần khi cuộn qua
// ảnh trong .js-pimg / .prose figure: ảnh trôi bên trong khung
// dải xanh (.dark, .hero, ...): hoa văn nền trôi chậm hơn nội dung (biến --py)
//
// Người xem bật "giảm chuyển động": không tắt hẳn mà giảm biên độ còn một nửa.
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const BANDS = '.dark, .hero, .page-head, .ab-hero, .ft, .nf';

export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const k = reduce ? 0.5 : 1; // hệ số biên độ
    const cleanups: (() => void)[] = [];

    // ---------- hiện dần ----------
    document.querySelectorAll<HTMLElement>('[data-delay]').forEach((el) => el.style.setProperty('--d', el.dataset.delay!));
    const revealIO = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); revealIO.unobserve(e.target); }
      }),
      { rootMargin: '0px 0px -12% 0px' },
    );
    document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => revealIO.observe(el));
    cleanups.push(() => revealIO.disconnect());

    // ---------- đếm số ----------
    const countIO = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      countIO.unobserve(e.target);
      const el = e.target as HTMLElement;
      const end = Number(el.dataset.count);
      const t0 = performance.now();
      const dur = reduce ? 800 : 1600;
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4))).toLocaleString('vi-VN');
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0';
      requestAnimationFrame(tick);
    }), { threshold: 0.6 });
    document.querySelectorAll('[data-count]').forEach((el) => countIO.observe(el));
    cleanups.push(() => countIO.disconnect());

    // ---------- parallax ----------
    const layers = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
    const hero = document.querySelector<HTMLElement>('[data-parallax-hero]');
    const frames = [...document.querySelectorAll<HTMLElement>('.js-pimg, .prose figure')]
      // ảnh trong bài viết (thường là sơ đồ có chữ sát mép) chỉ phóng nhẹ để không bị cắt chữ
      .map((f) => ({ f, img: f.querySelector('img'), soft: !!f.closest('.prose') }))
      .filter((x): x is { f: HTMLElement; img: HTMLImageElement; soft: boolean } => !!x.img);
    frames.forEach(({ f }) => f.classList.add('pimg'));
    const bands = [...document.querySelectorAll<HTMLElement>(BANDS)];

    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const inView = (r: DOMRect) => r.bottom > -200 && r.top < vh + 200;

      layers.forEach((el) => {
        const r = el.parentElement!.getBoundingClientRect();
        if (!inView(r)) return;
        el.style.transform = `translate3d(0, ${((r.top + r.height / 2 - vh / 2) * Number(el.dataset.parallax) * k).toFixed(1)}px, 0)`;
      });

      if (hero) {
        const y = Math.min(window.scrollY, vh);
        hero.style.transform = `translate3d(0, ${(y * 0.28 * k).toFixed(1)}px, 0)`;
        hero.style.opacity = String(Math.max(0, 1 - (y / (vh * 0.85)) * k));
      }

      // ảnh trôi trong khung: -1 (khung ở đáy màn hình) .. 1 (khung ở đỉnh)
      frames.forEach(({ f, img, soft }) => {
        const r = f.getBoundingClientRect();
        if (!inView(r)) return;
        const p = (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2);
        img.style.transform = `translate3d(0, ${(p * (soft ? 2.5 : 6) * k).toFixed(2)}%, 0) scale(${soft ? 1.06 : 1.14})`;
      });

      // hoa văn nền dải xanh trôi chậm hơn nội dung
      bands.forEach((b) => {
        const r = b.getBoundingClientRect();
        if (!inView(r)) return;
        b.style.setProperty('--py', (r.top * 0.35 * k).toFixed(1));
      });
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    cleanups.push(() => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    });

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
