'use client';
// Sóng đường mảnh ở nền hero (canvas). Chỉ chạy khi hero đang hiển thị.
import { useEffect, useRef } from 'react';

export default function HeroWaves() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#5ea8ff';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const LINES = 26;
    let w = 0, h = 0, t = 0, raf = 0, visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < LINES; i++) {
        const k = i / LINES;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.05 + 0.22 * Math.sin(Math.PI * k);
        ctx.lineWidth = 1;
        for (let x = 0; x <= w; x += 8) {
          const nx = x / w;
          const y = h * (0.58 + 0.06 * k)
            + Math.sin(nx * 3.2 + t * 0.6 + k * 2.4) * h * (0.08 + 0.05 * k)
            + Math.sin(nx * 7.5 - t * 0.35 + k) * h * 0.02;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };
    const loop = () => {
      if (!visible) return;
      t += 0.008;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const onResize = () => { resize(); draw(); };

    resize();
    window.addEventListener('resize', onResize);
    if (reduce) draw();
    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was && !reduce) loop();
    });
    io.observe(canvas);
    if (!reduce) loop();

    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', onResize); };
  }, []);

  return <canvas ref={ref} className="hero__waves" aria-hidden="true" />;
}
