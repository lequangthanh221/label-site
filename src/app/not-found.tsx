import Button from '@/components/Button';

export const metadata = { title: 'Không tìm thấy trang' };

export default function NotFound() {
  return (
    <section className="nf">
      <div className="container">
        <p className="nf__code">404</p>
        <h1>Không tìm thấy trang</h1>
        <p className="nf__text">Trang bạn tìm có thể đã được đổi địa chỉ.</p>
        <Button href="/">Về trang chủ</Button>
      </div>
    </section>
  );
}
