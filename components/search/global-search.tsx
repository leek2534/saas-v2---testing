"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search, Users, MessageSquare, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";

interface GlobalSearchProps {
  teamId?: Id<"teams">;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function GlobalSearch({
  teamId,
  open: controlledOpen,
  onOpenChange,
}: GlobalSearchProps) {
  const [open, setOpen] = useState(controlledOpen ?? false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const searchResults = useQuery(
    api.search.globalSearch,
    searchQuery.length > 0
      ? { query: searchQuery, teamId }
      : "skip"
  );

  const isOpen = controlledOpen ?? open;
  const setIsOpen = onOpenChange ?? setOpen;

  const handleSelect = (type: string, item: any) => {
    if (type === "team" && item.slug) {
      router.push(`/t/${item.slug}`);
    } else if (type === "message" && item.teamSlug) {
      router.push(`/t/${item.teamSlug}`);
    } else if (type === "member" && item.teamSlug) {
      router.push(`/t/${item.teamSlug}/settings/members`);
    }
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setIsOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Search teams, members, messages..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {searchResults && (
            <>
              {searchResults.teams.length > 0 && (
                <CommandGroup heading="Teams">
                  {searchResults.teams.map((team) => (
                    <CommandItem
                      key={team._id}
                      onSelect={() => handleSelect("team", team)}
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      <span>{team.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {searchResults.members.length > 0 && (
                <CommandGroup heading="Members">
                  {searchResults.members.map((member) => (
                    <CommandItem
                      key={member._id}
                      onSelect={() => handleSelect("member", member)}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      <span>{member.userName}</span>
                      <span className="text-muted-foreground ml-2">
                        in {member.teamName}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {searchResults.messages.length > 0 && (
                <CommandGroup heading="Messages">
                  {searchResults.messages.map((message) => (
                    <CommandItem
                      key={message._id}
                      onSelect={() => handleSelect("message", message)}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span className="truncate">{message.text}</span>
                      <span className="text-muted-foreground ml-2">
                        by {message.author}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}






