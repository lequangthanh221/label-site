// Biểu tượng logo Hoàng Lộc (tam giác chữ H-L), vector dựng lại từ logo gốc.
// Tô bằng currentColor: đặt `color` ở phần tử cha để đổi màu (trắng / xanh).
export const MARK_PATH =
  'M235 0L470 470H0Z M196 92L176 131H196Z M274 90V131H294Z M196 140V213H274V138L294 223H174Z M151 365L121 465H196V377H274V413H324L338 465H346L320 365Z';

export default function BrandMark({ size = 30, className, title }: { size?: number; className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 470 470" width={size} height={size} className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <path fill="currentColor" fillRule="evenodd" d={MARK_PATH} />
    </svg>
  );
}
