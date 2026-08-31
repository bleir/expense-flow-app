import { HeadingProps } from "@/types";

export default function Heading({ title, children }: HeadingProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-muted-foreground">{children}</p>
    </section>
  );
}
