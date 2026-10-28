/*
  The big headline spread across the full width:
  first part on the left, last part on the right, any middle parts in between.
  Phones and portrait tablets: one plain left-aligned headline (spread out, it reads as broken).
*/
type Props = {
  parts: string[];
  as?: "h2" | "h3";
  className?: string;
};

export function SplitHeading({ parts, as: Tag = "h2", className = "" }: Props) {
  return (
    <Tag className={`text-h1 px-5 md:flex md:flex-row md:justify-between ${className}`}>
      {parts.map((part) => (
        <span key={part}>{part} </span>
      ))}
    </Tag>
  );
}
