import React from "react";
import { Dock, DockIcon } from "@/components/ui/dock"; // Adjust path as needed
import { PencilRuler, RadioTower } from 'lucide-react'; // Import icons

export function DockDemo() {
  return (
    <div className="relative">
      <Dock magnification={60} distance={100} className="dock-container">
        {/* Feeds Tab (Replaced with RadioTower Icon) */}
        <DockIcon className="bg-black/10 dark:bg-white/10 p-3">
          <RadioTower className="icon-size" /> {/* Using the RadioTower icon */}
        </DockIcon>

        {/* Editor Tab (Replaced with PencilRuler Icon) */}
        <DockIcon className="bg-black/10 dark:bg-white/10 p-3">
          <PencilRuler className="icon-size" /> {/* Using the PencilRuler icon */}
        </DockIcon>
      </Dock>
    </div>
  );
}

