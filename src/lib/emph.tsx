// Tiêu đề có từ nhấn: "Tem nhãn cho từng [[ngành hàng]]", "\n" để xuống dòng.
import { Fragment, type ReactNode } from 'react';

/** Tách thành từng từ (span.w) để hiện dần lần lượt; [[...]] thành <em class="hl">. */
export function Words({ text }: { text: string }) {
  let i = 0;
  const words = (s: string) =>
    s.split(/(\s+)/).map((part, k) => {
      if (!part) return null;
      // giữ khoảng trắng trước <br> để khi ẩn <br> trên mobile các từ không dính nhau
      if (/^\s+$/.test(part)) return part.includes('\n') ? <Fragment key={k}>{' '}<br /></Fragment> : ' ';
      return (
        <span key={k} className="w" style={{ ['--i' as string]: i++ }}>
          {part}
        </span>
      );
    });
  const nodes: ReactNode[] = [];
  text.split(/(\[\[.+?\]\])/).forEach((chunk, k) => {
    const m = chunk.match(/^\[\[(.+)\]\]$/);
    nodes.push(m ? <em key={k} className="hl">{words(m[1])}</em> : <Fragment key={k}>{words(chunk)}</Fragment>);
  });
  return <>{nodes}</>;
}

/** Bỏ ký hiệu nhấn - dùng cho title/alt. */
export const plain = (s: string) => s.replace(/\[\[(.+?)\]\]/g, '$1').replace(/\n/g, ' ');
