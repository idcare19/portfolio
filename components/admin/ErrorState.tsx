type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return <p className="text-sm font-medium text-rose-600">{message}</p>;
}
