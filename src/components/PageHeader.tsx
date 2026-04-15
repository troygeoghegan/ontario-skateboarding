import { SectionLabel } from "@/components/SectionLabel";

type PageHeaderProps = {
  label: string;
  title: string;
  description?: string;
};

export function PageHeader({ label, title, description }: PageHeaderProps) {
  return (
    <div className="border-b border-zinc-800 bg-gradient-to-b from-zinc-900/50 to-asphalt py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionLabel>{label}</SectionLabel>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl font-body text-lg text-zinc-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
