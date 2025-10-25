"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export function Section({ className, children, ...props }: SectionProps) {
  return (
    <section className={cn("container-custom section", className)} {...props}>
      {children}
    </section>
  );
}

export default Section;
