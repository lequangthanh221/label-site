'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { nav, site } from '@/config/site';
import Logo from './Logo';

export default function Header() {
  const current = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 400 && y > lastY); // ẩn khi cuộn xuống, hiện khi cuộn lên
      lastY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // đóng menu mobile khi đổi trang
  useEffect(() => setOpen(false), [current]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const isActive = (href: string, children?: { href: string }[]) =>
    current === href || !!children?.some((c) => c.href === current);

  const cls = ['hd', scrolled && 'is-scrolled', hidden && !open && 'is-hidden', open && 'is-open'].filter(Boolean).join(' ');

  return (
    <header className={cls}>
      <div className="container hd__inner">
        <Link href="/" className="hd__logo"><Logo /></Link>

        <nav className="hd__nav" aria-label="Chính">
          <ul>
            {nav.filter((i) => i.href !== '/lien-he/').map((item) => (
              <li key={item.href} className={item.children ? 'has-sub' : undefined}>
                <Link href={item.href} className="hd__link" aria-current={isActive(item.href, item.children) ? 'page' : undefined}>
                  <span className="hd__roll" data-text={item.label}>{item.label}</span>
                </Link>
                {item.children && (
                  <div className="hd__sub">
                    <ul>
                      {item.children.map((c) => <li key={c.href}><Link href={c.href}>{c.label}</Link></li>)}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/lien-he/" className="hd__cta">Liên hệ</Link>

        <button className="hd__burger" aria-label="Mở menu" aria-expanded={open} aria-controls="mnav" onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
      </div>

      <div className="mnav" id="mnav" hidden={!open}>
        <div className="container">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
                {item.children && (
                  <ul className="mnav__sub">
                    {item.children.map((c) => <li key={c.href}><Link href={c.href}>{c.label}</Link></li>)}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <p className="mnav__contact">
            <a href={site.contact.phoneHref}>{site.contact.phone}</a><br />
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          </p>
        </div>
      </div>
    </header>
  );
}
