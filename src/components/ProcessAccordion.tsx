'use client';
// Quy trình: accordion ngang (desktop) / dọc (mobile) - luôn mở đúng 1 bước.
import { useState } from 'react';

type Step = { id: string; label: string; title: string; text: string; image: string };

export default function ProcessAccordion({ steps }: { steps: Step[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="acc" data-reveal>
      {steps.map((s, i) => (
        <article key={s.id} className={`acc__item${open === i ? ' is-open' : ''}`}>
          <img className="acc__img" src={s.image} alt="" loading="lazy" />
          <button
            className="acc__btn"
            aria-expanded={open === i}
            aria-controls={`step-${s.id}`}
            id={`step-btn-${s.id}`}
            onClick={() => setOpen(i)}
          >
            <span className="acc__no">Bước {i + 1}<span className="acc__of">/{steps.length}</span></span>
            <span className="acc__label">{s.label}</span>
            <span className="acc__plus" aria-hidden="true" />
          </button>
          <div className="acc__panel" id={`step-${s.id}`} role="region" aria-labelledby={`step-btn-${s.id}`}>
            <div className="acc__inner">
              <img className="acc__img--m" src={s.image} alt="" loading="lazy" />
              <div className="acc__text">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
