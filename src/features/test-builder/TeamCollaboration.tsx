"use client";



import React, { useState } from 'react';
import { UserPlus, Users, X, Clock, Eye, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock team members data
const MOCK_TEAM_MEMBERS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    avatar: null,
    status: 'online',
    role: 'Editor',
    lastActive: 'Active now',
    isEditing: true,
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@company.com',
    avatar: null,
    status: 'online',
    role: 'Viewer',
    lastActive: 'Active now',
    isEditing: false,
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily@company.com',
    avatar: null,
    status: 'away',
    role: 'Editor',
    lastActive: '5 minutes ago',
    isEditing: false,
  },
  {
    id: '4',
    name: 'John Smith',
    email: 'john@company.com',
    avatar: null,
    status: 'offline',
    role: 'Editor',
    lastActive: '2 hours ago',
    isEditing: false,
  },
];

// Mock activity history
const MOCK_ACTIVITY = [
  {
    id: '1',
    user: 'Sarah Johnson',
    action: 'Added a new section',
    sectionName: 'Hero Section',
    timestamp: '2 minutes ago',
    type: 'add',
  },
  {
    id: '2',
    user: 'Mike Chen',
    action: 'Updated button text',
    elementName: 'CTA Button',
    timestamp: '5 minutes ago',
    type: 'edit',
  },
  {
    id: '3',
    user: 'Emily Davis',
    action: 'Deleted a row',
    sectionName: 'Features Section',
    timestamp: '15 minutes ago',
    type: 'delete',
  },
  {
    id: '4',
    user: 'Sarah Johnson',
    action: 'Changed heading color',
    elementName: 'Main Heading',
    timestamp: '23 minutes ago',
    type: 'edit',
  },
  {
    id: '5',
    user: 'John Smith',
    action: 'Added testimonial element',
    sectionName: 'Social Proof',
    timestamp: '1 hour ago',
    type: 'add',
  },
];

export function TeamCollaboration() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('team');

  const onlineCount = MOCK_TEAM_MEMBERS.filter(m => m.status === 'online').length;
  const editingCount = MOCK_TEAM_MEMBERS.filter(m => m.isEditing).length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="relative"
          title="Team Collaboration"
        >
          <UserPlus className="w-4 h-4 mr-1" />
          Team
          {onlineCount > 0 && (
            <Badge className="ml-1.5 h-5 px-1.5 bg-green-500 hover:bg-green-600" suppressHydrationWarning>
              {onlineCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Collaboration
          </DialogTitle>
          <DialogDescription>
            Collaborate with your team in real-time. See who's editing and track all changes.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team Members ({MOCK_TEAM_MEMBERS.length})
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Activity History
            </TabsTrigger>
          </TabsList>

          {/* Team Members Tab */}
          <TabsContent value="team" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {MOCK_TEAM_MEMBERS.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={member.avatar || undefined} />
                          <AvatarFallback className="bg-blue-500 text-white">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {/* Status indicator */}
                        <div
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                            member.status === 'online'
                              ? 'bg-green-500'
                              : member.status === 'away'
                              ? 'bg-yellow-500'
                              : 'bg-gray-400'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {member.name}
                          </p>
                          {member.isEditing && (
                            <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700">
                              <Edit3 className="w-3 h-3 mr-1" />
                              Editing
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {member.email}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {member.lastActive}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.role === 'Editor' ? 'default' : 'secondary'}>
                        {member.role === 'Editor' ? <Edit3 className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button className="w-full" variant="outline">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Team Member
              </Button>
            </div>
          </TabsContent>

          {/* Activity History Tab */}
          <TabsContent value="activity" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {MOCK_ACTIVITY.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'add'
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                          : activity.type === 'edit'
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      }`}
                    >
                      {activity.type === 'add' ? (
                        <span className="text-lg font-bold">+</span>
                      ) : activity.type === 'edit' ? (
                        <Edit3 className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.user}</span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">{activity.action}</span>
                      </p>
                      {(activity.sectionName || activity.elementName) && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {activity.sectionName || activity.elementName}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
