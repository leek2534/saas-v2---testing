"use client";

import React from "react";
import type { ElementNode } from "../../store/types";
import { VideoSettingsPanel } from "./video/VideoSettingsPanel";

export function VideoPanel({ node }: { node: ElementNode }) {
  return <VideoSettingsPanel node={node} />;
}
