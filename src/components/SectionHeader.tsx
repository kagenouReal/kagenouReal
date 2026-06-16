export default function SectionHeader({ tag, num, title }: { tag: string; num: string; title: string }) {
  return (
    <div className="mb-12">
      <span className="font-mono text-[0.65rem] text-brand tracking-[0.22em] uppercase">
        // {num}. {tag}
      </span>
      <h2 className="font-mono text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold text-text-main m-0 mt-1.5 tracking-tight leading-[1.1]">
        {title}
      </h2>
    </div>
  );
}
