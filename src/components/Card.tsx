import Link from 'next/link';

export type CardData = { href: string; title: string; image?: string; text?: string };

export default function Card({ href, title, image, text }: CardData) {
  return (
    <Link className="card" href={href} data-reveal>
      <div className="card__img">{image ? <img src={image} alt="" loading="lazy" /> : <span aria-hidden="true" />}</div>
      <div className="card__body">
        <h3>{title}</h3>
        {text && <p>{text}</p>}
        <span className="card__go">Xem chi tiết ↗</span>
      </div>
    </Link>
  );
}
