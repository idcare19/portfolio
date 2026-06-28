
type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {

  return (
    <div
      className="rounded-[28px] border px-5 py-10 text-center border-admin-border bg-admin-card shadow-lg"
    >
      <p className="text-sm font-medium text-admin-text">{message}</p>
    </div>
  );
}
