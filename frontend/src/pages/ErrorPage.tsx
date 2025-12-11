type ErrorProps = {
  code: number;
  message: string;
};

export default function ErrorPage({
  code,
  message,
}: ErrorProps) {
  return (
    <div className="flex flex-1 items-center justify-center min-h-svh h-full">
      <h1 className="text-3xl font-bold text-destructive">{code} - {message}</h1>
    </div>
  );
}