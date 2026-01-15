import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/typography/link";

export function EmptyTeam() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Users className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No teams yet</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        Get started by creating your first team. Teams help you organize
        members and collaborate effectively.
      </p>
      <Button asChild>
        <Link href="/t">Create Team</Link>
      </Button>
    </div>
  );
}






