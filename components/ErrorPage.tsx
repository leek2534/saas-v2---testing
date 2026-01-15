"use client";

import { SignOutButton as ClerkSignOutButton } from "@clerk/nextjs";

export function ErrorPage({
  title,
  message,
  instructions,
  errorMessage,
  variant = "error",
}: {
  title: string;
  message: string;
  instructions?: React.ReactNode;
  errorMessage?: string;
  variant?: "error" | "warning";
}) {
  const bgColor = variant === "warning" 
    ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
  
  return (
    <div className="container max-w-2xl mx-auto p-8">
      <div className={`${bgColor} border rounded-lg p-6`}>
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p className="mb-4">{message}</p>
        {instructions && <div className="mb-4">{instructions}</div>}
        {errorMessage && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Error: {errorMessage}
          </p>
        )}
        <div className="mt-4">
          <ClerkSignOutButton>
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              Sign Out
            </button>
          </ClerkSignOutButton>
        </div>
      </div>
    </div>
  );
}






