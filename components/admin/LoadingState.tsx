type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return <p className="text-sm text-slate-600">{message}</p>;
}
