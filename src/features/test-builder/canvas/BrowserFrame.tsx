import { cn } from '@/lib/utils';

interface BrowserFrameProps {
  viewMode: 'edit' | 'preview';
  pageUrl?: string;
  children: React.ReactNode;
}

/**
 * BrowserFrame - Wraps content in a browser-like frame with traffic lights and URL bar
 * Only shows the chrome in edit mode
 */
export function BrowserFrame({ viewMode, pageUrl, children }: BrowserFrameProps) {
  return (
    <div className={cn(
      "overflow-x-hidden w-full max-w-full transition-all",
      viewMode === 'edit' ? "rounded-xl shadow-2xl border border-border/50 bg-card" : "bg-card"
    )}>
      {/* Browser Chrome - Only in edit mode */}
      {viewMode === 'edit' && (
        <BrowserChrome pageUrl={pageUrl} />
      )}

      {/* Page Content */}
      <div className={cn(
        "bg-white dark:bg-white text-neutral-900 overflow-x-hidden w-full max-w-full min-h-[400px]",
        viewMode === 'edit' && "rounded-b-xl"
      )}>
        {children}
      </div>
    </div>
  );
}

/**
 * BrowserChrome - The top bar with traffic lights and URL
 */
function BrowserChrome({ pageUrl }: { pageUrl?: string }) {
  const displayUrl = pageUrl || 'https://yoursite.com/page';

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-border/50 rounded-t-xl">
      {/* Traffic Lights */}
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
      </div>

      {/* URL Bar */}
      <div className="flex-1 mx-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-700 rounded-md border border-border/50 text-xs text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="font-mono truncate">{displayUrl}</span>
        </div>
      </div>
    </div>
  );
}
