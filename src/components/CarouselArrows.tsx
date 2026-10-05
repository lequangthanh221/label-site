'use client';
// Nút trước/sau cho dải cuộn ngang có id = trackId.
export default function CarouselArrows({ trackId }: { trackId: string }) {
  const go = (dir: number) => {
    const track = document.getElementById(trackId);
    if (!track) return;
    const step = ((track.firstElementChild as HTMLElement | null)?.offsetWidth ?? 300) + 20;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  };
  return (
    <div className="arrows" data-reveal>
      <button onClick={() => go(-1)} aria-label="Trước">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 3 5 8l5 5" /></svg>
      </button>
      <button onClick={() => go(1)} aria-label="Sau">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 3 5 5-5 5" /></svg>
      </button>
    </div>
  );
}
