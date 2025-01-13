interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'กำลังโหลด...' }: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-purple-800/90 p-6 rounded-lg shadow-xl text-center">
        <div className="flex justify-center mb-4">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s] mx-2" />
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
        <p className="text-purple-200">{message}</p>
      </div>
    </div>
  );
} 