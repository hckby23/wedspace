"use client";

import React from "react";
import { cn } from "@/lib/utils";

type Actions = React.ReactNode;

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  lead?: string;
  actions?: Actions;
}

export default function PageHeader({ title, lead, actions, className, ...props }: PageHeaderProps) {
  return (
    <div className={cn("page-header container-custom", className)} {...props}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1>{title}</h1>
          {lead ? <p className="lead mt-2">{lead}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
