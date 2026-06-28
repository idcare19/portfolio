
type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: ErrorStateProps) {

  return (
    <div className="rounded-[24px] border px-4 py-3 text-sm font-medium border-admin-danger/50 bg-admin-danger/10 text-admin-danger">
      {message}
    </div>
  );
}
