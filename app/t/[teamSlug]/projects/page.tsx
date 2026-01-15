"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FolderOpen, Clock, Users } from "lucide-react";

export default function ProjectsPage() {
  const projects = [
    {
      name: "Website Redesign",
      description: "Complete overhaul of company website",
      status: "In Progress",
      members: 4,
      lastUpdated: "2 hours ago",
      color: "bg-blue-500"
    },
    {
      name: "Mobile App",
      description: "iOS and Android mobile application",
      status: "Planning",
      members: 3,
      lastUpdated: "1 day ago",
      color: "bg-purple-500"
    },
    {
      name: "Marketing Campaign",
      description: "Q1 2024 marketing materials",
      status: "In Progress",
      members: 5,
      lastUpdated: "3 hours ago",
      color: "bg-green-500"
    },
    {
      name: "Product Launch",
      description: "New product line launch materials",
      status: "Completed",
      members: 6,
      lastUpdated: "1 week ago",
      color: "bg-gray-500"
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage and organize your team's projects
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${project.color} flex items-center justify-center`}>
                    <FolderOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {project.members}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {project.lastUpdated}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Badge variant={
                project.status === "Completed" ? "default" :
                project.status === "In Progress" ? "secondary" :
                "outline"
              }>
                {project.status}
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates across all projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium">Website Redesign updated</p>
                <p className="text-sm text-muted-foreground">New designs added to homepage section</p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium">Marketing Campaign updated</p>
                <p className="text-sm text-muted-foreground">Social media assets finalized</p>
                <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-2 w-2 rounded-full bg-purple-500 mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium">Mobile App created</p>
                <p className="text-sm text-muted-foreground">New project started by John Doe</p>
                <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
