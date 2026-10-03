import { HeadingProps } from "@/types";

export default function Heading({ title, children }: HeadingProps) {
  return (
    <section>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-1 text-muted-foreground">{children}</p>
    </section>
  );
}
