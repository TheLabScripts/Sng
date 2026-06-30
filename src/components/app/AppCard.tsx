export function AppCard({
  children,
  className = "",
  as = "section",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div" | "article";
}) {
  const Component = as;
  return (
    <Component className={`rounded-[18px] border app-card-glass p-4 shadow-card sm:p-5 ${className}`}>
      {children}
    </Component>
  );
}
