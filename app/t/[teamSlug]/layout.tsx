import { ConvexClientProvider } from "@/app/ConvexClientProvider";
import { AcceptInviteDialog } from "@/app/t/AcceptInviteDialog";
import { Notifications } from "@/app/t/Notifications";
import { TeamMenu } from "@/app/t/TeamMenu";
import { ProfileButton } from "@/app/t/[teamSlug]/ProfileButton";
import { TeamSwitcher } from "@/app/t/TeamSwitcher";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <ConvexClientProvider>
        <div className="flex h-screen overflow-hidden flex-col">
          {/* Top Bar */}
          <header className="h-16 border-b bg-background flex items-center justify-between px-6">
            <TeamSwitcher />
            <div className="flex items-center gap-4">
              <Notifications />
              <ProfileButton />
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar */}
            <aside className="w-64 border-r bg-background flex flex-col">
              {/* Navigation Menu */}
              <nav className="flex-1 overflow-y-auto p-4">
                <TeamMenu />
              </nav>
            </aside>
            
            {/* Main Content */}
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
        <AcceptInviteDialog />
        <Toaster />
      </ConvexClientProvider>
    </Suspense>
  );
}
