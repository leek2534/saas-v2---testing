import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyMembersProps {
  onInvite?: () => void;
}

export function EmptyMembers({ onInvite }: EmptyMembersProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="rounded-full bg-muted p-6 mb-4">
        <UserPlus className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No members yet</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        Invite team members to collaborate. They&apos;ll receive an email
        invitation to join.
      </p>
      {onInvite && (
        <Button onClick={onInvite}>Invite Members</Button>
      )}
    </div>
  );
}






