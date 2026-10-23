/*
  The big headline spread across the full width:
  first part on the left, last part on the right, any middle parts in between.
*/
type Props = {
  parts: string[];
  as?: "h2" | "h3";
  className?: string;
};

export function SplitHeading({ parts, as: Tag = "h2", className = "" }: Props) {
  return (
    <Tag className={`text-h1 flex flex-col px-5 md:flex-row md:justify-between ${className}`}>
      {parts.map((part, index) => (
        <span key={part} className={index === parts.length - 1 ? "self-end md:self-auto" : ""}>
          {part}
        </span>
      ))}
    </Tag>
  );
}
