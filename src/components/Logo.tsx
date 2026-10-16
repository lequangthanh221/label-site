// Lockup: biểu tượng + chữ "Temnhanmavach" (phần "mavach" tô màu nhấn).
import { site } from '@/config/site';
import BrandMark from './BrandMark';

export default function Logo({ withCompany = false }: { withCompany?: boolean }) {
  return (
    <span className="logo" aria-label={site.name}>
      <BrandMark className="logo__mark" size={30} />
      <span className="logo__words" aria-hidden="true">
        <span className="logo__text">Temnhan<span className="logo__accent">mavach</span></span>
        {withCompany && <span className="logo__company">{site.legalName}</span>}
      </span>
    </span>
  );
}
