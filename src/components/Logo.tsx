// Logo chữ tạm - thay bằng logo thật khi có brand guidelines. Dùng currentColor để tự đổi màu theo nền.
import { site } from '@/config/site';

export default function Logo() {
  return (
    <span className="logo" aria-label={site.name}>
      <svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">
        <rect x="1" y="1" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 9h12M8 14h12M8 19h7" stroke="var(--accent)" strokeWidth="1.8" />
      </svg>
      <span className="logo__text">{site.name}<span className="logo__dot">.</span></span>
    </span>
  );
}
