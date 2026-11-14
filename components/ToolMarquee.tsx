type ToolMarqueeProps = {
  items: string[];
};

/** Endless strip of tool names. The list renders twice so the loop is seamless. */
export default function ToolMarquee({ items }: ToolMarqueeProps) {
  return (
    <div
      className="marquee relative overflow-hidden border-y border-border py-4"
      aria-label={`Tools I use: ${items.join(", ")}`}
    >
      <div className="marquee-track flex w-max gap-10" aria-hidden="true">
        {[...items, ...items].map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="label-text flex items-center gap-10 whitespace-nowrap text-xs text-muted"
          >
            {item}
            <span className="text-faint">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
