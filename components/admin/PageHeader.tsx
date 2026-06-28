type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-admin-border bg-white p-4 shadow-sm backdrop-blur sm:p-5">
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#DBEAFE] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-14 -left-8 h-32 w-32 rounded-full bg-[#E2E8F0] blur-3xl" />
      <h1 className="relative text-xl font-bold tracking-tight text-admin-text sm:text-2xl">{title}</h1>
      {description ? <p className="relative mt-1 text-sm text-admin-text-muted">{description}</p> : null}
    </div>
  );
}
