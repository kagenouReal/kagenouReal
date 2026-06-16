import { STACK_ICONS } from '../data';

export default function Marquee() {
  const items = [...STACK_ICONS, ...STACK_ICONS, ...STACK_ICONS];
  
  return (
    <div className="w-full overflow-hidden border-y border-border-subtle py-3.5 my-0 flex">
      <div className="flex gap-10 whitespace-nowrap animate-[marquee_22s_linear_infinite] w-max">
        {items.map((item, i) => (
          <span key={i} className="font-mono text-[0.72rem] text-text-muted tracking-[0.12em]">
            <span className="text-brand mr-2">◆</span>{item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
}
