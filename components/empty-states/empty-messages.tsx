import { MessageSquare } from "lucide-react";

export function EmptyMessages() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="rounded-full bg-muted p-6 mb-4">
        <MessageSquare className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
      <p className="text-muted-foreground text-center max-w-md">
        Start a conversation by sending your first message to the team.
      </p>
    </div>
  );
}






