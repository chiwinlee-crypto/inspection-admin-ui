export function SectionTitle({ title, right }: { title: string; right?: any }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      {right}
    </div>
  );
}
