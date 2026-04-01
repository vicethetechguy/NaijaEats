import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface DockProps {
  className?: string
  activeLabel?: string
  items: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    onClick?: () => void
  }[]
}

export default function Dock({ items, className, activeLabel }: DockProps) {
  return (
    <div className={cn("w-full bg-card border-t border-border pb-6 pt-2 px-2", className)}>
      <div className="flex items-center w-full justify-around h-16">
        {items.map((item) => {
          const isActive = activeLabel === item.label
          const formattedLabel = item.label.charAt(0).toUpperCase() + item.label.slice(1).toLowerCase();

          return (
            <div
              key={item.label}
              className="relative flex flex-col items-center flex-1"
            >
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-2xl relative w-full h-14 bg-transparent hover:bg-transparent",
                  isActive && "text-primary"
                )}
                onClick={item.onClick}
              >
                <div className="flex flex-col items-center justify-center w-full h-full relative z-10 gap-1.5">
                  <item.icon
                    className={cn(
                      "transition-colors duration-200",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span className={cn(
                    "text-[10px] font-normal transition-colors duration-200",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {formattedLabel}
                  </span>
                </div>
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
