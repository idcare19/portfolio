type DataTableProps<T extends Record<string, unknown>> = {
  rows: T[];
  columns: Array<{ key: keyof T; label: string }>;
};

export function DataTable<T extends Record<string, unknown>>({ rows, columns }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-[24px] border border-admin-border bg-admin-card shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
      <table className="min-w-full text-sm">
        <thead className="bg-admin-bg text-left text-admin-text-muted">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-4 py-2.5 font-semibold">{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-admin-border">
              {columns.map((column) => (
                <td key={String(column.key)} className="px-4 py-2.5 text-admin-text">{String(row[column.key] ?? "-")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
