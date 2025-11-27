import { Spinner } from './Spinner';

export interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message }: PageLoaderProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      {message && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {message}
        </p>
      )}
    </div>
  );
}
