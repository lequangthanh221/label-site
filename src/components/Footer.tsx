import Link from 'next/link';
import { nav, site } from '@/config/site';
import Logo from './Logo';

export default function Footer() {
  const products = nav.find((n) => n.href === '/san-pham/')?.children ?? [];
  const services = nav.find((n) => n.href === '/dich-vu/')?.children ?? [];
  return (
    <footer className="ft">
      <div className="container ft__grid">
        <div className="ft__brand">
          <Logo />
          <p>{site.description}</p>
          <ul className="ft__contact">
            <li><a href={site.contact.phoneHref}>{site.contact.phone}</a></li>
            <li><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></li>
            <li>{site.contact.address}</li>
          </ul>
        </div>
        <div>
          <h2>Sản phẩm</h2>
          <ul>{products.slice(0, 7).map((i) => <li key={i.href}><Link href={i.href}>{i.label.replace('In tem nhãn ', 'Tem nhãn ')}</Link></li>)}</ul>
        </div>
        <div>
          <h2>Dịch vụ</h2>
          <ul>{services.map((i) => <li key={i.href}><Link href={i.href}>{i.label}</Link></li>)}</ul>
        </div>
        <div>
          <h2>Trang</h2>
          <ul>
            <li><Link href="/">Trang chủ</Link></li>
            {nav.filter((n) => !n.children).map((i) => <li key={i.href}><Link href={i.href}>{i.label}</Link></li>)}
          </ul>
        </div>
      </div>
      <div className="container ft__bottom">
        <span>© {new Date().getFullYear()} {site.legalName}</span>
        <a href="#top" className="ft__top">Lên đầu trang ↑</a>
      </div>
    </footer>
  );
}
