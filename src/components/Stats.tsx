// Dải 4 con số - khối nhấn mạnh nhất trang, nền tối.
import { stats } from '@/config/home';
import { Words } from '@/lib/emph';

export default function Stats({ title = 'Những [[con số]] nói thay chúng tôi' }: { title?: string }) {
  return (
    <section className="stats dark">
      <div className="container">
        <h2 className="stats__title" data-reveal="words"><Words text={title} /></h2>
        <ul className="stats__grid">
          {stats.map((s, i) => (
            <li key={s.label} className="stat" data-reveal data-delay={String(i * 120)}>
              <span className="stat__bar" aria-hidden="true" />
              <strong className="stat__num">
                <span data-count={s.value}>{s.value.toLocaleString('vi-VN')}</span>
                <span className="stat__suffix">{s.suffix}</span>
              </strong>
              <span className="stat__label">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
