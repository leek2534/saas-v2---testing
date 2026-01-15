"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eraser } from 'lucide-react';

export function BackgroundRemoverTool() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eraser className="h-5 w-5" />
          Background Remover
        </CardTitle>
        <CardDescription>
          Remove backgrounds from images automatically
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload an image to automatically remove its background using AI.
          </p>
          <Button className="w-full">
            Upload Image
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
