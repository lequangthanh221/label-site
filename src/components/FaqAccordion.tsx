'use client';
// Hỏi đáp: mở một câu, bấm lại để đóng.
import { useState } from 'react';

export default function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="faq__list">
      {items.map((f, i) => (
        // data-reveal ở lớp ngoài: className của .qa đổi theo state sẽ không xoá mất class is-in
        <div key={f.q} data-reveal data-delay={String(i * 80)}>
          <div className={`qa${open === i ? ' is-open' : ''}`}>
            <h3 className="qa__h">
              <button
                className="qa__btn"
                aria-expanded={open === i}
                aria-controls={`faq-${i}`}
                id={`faq-btn-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="qa__q">{f.q}</span>
                <span className="qa__plus" aria-hidden="true" />
              </button>
            </h3>
            <div className="qa__panel" id={`faq-${i}`} role="region" aria-labelledby={`faq-btn-${i}`}>
              <div className="qa__inner"><p>{f.a}</p></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
