"use client";

import React from "react";
import PageHeader from "@/components/layout/PageHeader";
import Section from "@/components/layout/Section";

interface DashboardTemplateProps {
  title: string;
  lead?: string;
  sidebar?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export default function DashboardTemplate({ title, lead, sidebar, actions, children }: DashboardTemplateProps) {
  return (
    <>
      <PageHeader title={title} lead={lead} actions={actions} />
      <Section>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {sidebar ? <aside className="lg:col-span-3">{sidebar}</aside> : null}
          <div className={sidebar ? "lg:col-span-9" : "lg:col-span-12"}>{children}</div>
        </div>
      </Section>
    </>
  );
}
