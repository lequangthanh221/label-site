// Chuyển động dùng chung — không thư viện ngoài.
// [data-reveal]          hiện dần từ mờ khi cuộn tới (data-delay = ms)
// [data-reveal="words"]  tách từng chữ, hiện lần lượt
// [data-count]           đếm số khi cuộn tới
// [data-parallax]        trôi theo cuộn (giá trị = hệ số, vd 0.15)
// [data-steps]           mục lục dính: đánh dấu bước đang xem
// [data-carousel]        nút trước/sau cho dải cuộn ngang
// [data-waves]           sóng đường mảnh ở hero (canvas)

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- tách chữ ----------
document.querySelectorAll<HTMLElement>('[data-reveal="words"]').forEach((el) => {
  let i = 0;
  const walk = (node: Node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent!.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.append(part);
          const span = document.createElement('span');
          span.className = 'w';
          span.style.setProperty('--i', String(i++));
          span.textContent = part;
          frag.append(span);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== 'BR') {
        walk(child);
      }
    });
  };
  walk(el);
});

// ---------- hiện dần ----------
document.querySelectorAll<HTMLElement>('[data-delay]').forEach((el) => el.style.setProperty('--d', el.dataset.delay!));
const revealIO = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); revealIO.unobserve(e.target); }
  }),
  { rootMargin: '0px 0px -12% 0px' },
);
document.querySelectorAll('[data-reveal]').forEach((el) => revealIO.observe(el));

// ---------- đếm số ----------
const countIO = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  countIO.unobserve(e.target);
  const el = e.target as HTMLElement;
  const end = Number(el.dataset.count);
  if (reduce) { el.textContent = end.toLocaleString('vi-VN'); return; }
  const t0 = performance.now();
  const dur = 1600;
  const tick = (t: number) => {
    const p = Math.min(1, (t - t0) / dur);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4))).toLocaleString('vi-VN');
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}), { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach((el) => countIO.observe(el));

// ---------- parallax ----------
const parallax = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
if (parallax.length && !reduce) {
  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    parallax.forEach((el) => {
      const r = el.parentElement!.getBoundingClientRect();
      const offset = (r.top + r.height / 2 - vh / 2) * Number(el.dataset.parallax);
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

// ---------- mục lục bước ----------
document.querySelectorAll<HTMLElement>('[data-steps]').forEach((root) => {
  const links = [...root.querySelectorAll<HTMLElement>('[data-step-link]')];
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const id = (e.target as HTMLElement).id;
    links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`));
  }), { rootMargin: '-45% 0px -45% 0px' });
  root.querySelectorAll('[data-step]').forEach((s) => io.observe(s));
});

// ---------- carousel ----------
document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
  const track = root.querySelector<HTMLElement>('[data-track]')!;
  const step = () => (track.querySelector<HTMLElement>(':scope > *')?.offsetWidth ?? 300) + 20;
  root.querySelector('[data-prev]')?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  root.querySelector('[data-next]')?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
});

// ---------- sóng hero ----------
document.querySelectorAll<HTMLCanvasElement>('canvas[data-waves]').forEach((canvas) => {
  const ctx = canvas.getContext('2d')!;
  const color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#5ea8ff';
  let w = 0, h = 0, running = true, t = 0;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const LINES = 26;
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
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };
  const loop = () => {
    if (!running) return;
    t += 0.008;
    draw();
    requestAnimationFrame(loop);
  };
  resize();
  window.addEventListener('resize', () => { resize(); draw(); });
  if (reduce) { draw(); return; }
  // chỉ chạy khi hero đang hiển thị
  new IntersectionObserver(([e]) => {
    const was = running;
    running = e.isIntersecting;
    if (running && !was) loop();
  }).observe(canvas);
  loop();
});

// ---------- accordion ----------
// [data-accordion="single"]  luôn mở đúng 1 mục (khối Quy trình)
// [data-accordion="toggle"]  mở 1 mục, bấm lại để đóng (Hỏi đáp)
document.querySelectorAll<HTMLElement>('[data-accordion]').forEach((root) => {
  const mode = root.dataset.accordion;
  const items = [...root.querySelectorAll<HTMLElement>('[data-acc-item]')];
  const set = (item: HTMLElement, open: boolean) => {
    item.classList.toggle('is-open', open);
    item.querySelector('[data-acc-btn]')!.setAttribute('aria-expanded', String(open));
  };
  items.forEach((item) => {
    item.querySelector('[data-acc-btn]')!.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      if (isOpen && mode === 'single') return;
      items.forEach((other) => set(other, other === item ? !isOpen : false));
    });
  });
});
