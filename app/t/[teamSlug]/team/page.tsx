"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Mail, MoreVertical } from "lucide-react";

export default function TeamPage() {
  const teamMembers = [
    { name: "John Doe", email: "john@example.com", role: "Owner", avatar: "" },
    { name: "Jane Smith", email: "jane@example.com", role: "Admin", avatar: "" },
    { name: "Mike Johnson", email: "mike@example.com", role: "Member", avatar: "" },
    { name: "Sarah Williams", email: "sarah@example.com", role: "Member", avatar: "" },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">
            Manage your team members and their roles
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Members</CardTitle>
          <CardDescription>
            {teamMembers.length} team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={member.role === "Owner" ? "default" : "secondary"}>
                    {member.role}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>
            Invitations waiting to be accepted
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No pending invitations
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
