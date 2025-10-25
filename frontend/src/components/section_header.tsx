interface SectionHeaderProps {
  title: string;
  subtitle: string;
  icon?: string;
  icon_class?: string;
  badge?: React.ReactNode;
}

export const SectionHeader = ({ title, subtitle, icon, icon_class = "text-2xl", badge }: SectionHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 ">
            {icon && <i className={`bx text-3xl  ${icon} ${icon_class}`}></i>}
            <h1 className="text-3xl font-bold">{title}</h1>
          </div>
          {badge}
        </div>
      </div>
      <p className="text-muted-foreground mt-2">{subtitle}</p>
    </div>
  );
};
