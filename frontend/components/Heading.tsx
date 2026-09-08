import { HeadingProps } from "@/types";

export default function Heading({ title, children }: HeadingProps) {
  return (
    <section className="mb-6">
      <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      <p className="text-muted-foreground">{children}</p>
    </section>
  );
}
