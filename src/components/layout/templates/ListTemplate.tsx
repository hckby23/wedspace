"use client";

import React from "react";
import PageHeader from "@/components/layout/PageHeader";
import Section from "@/components/layout/Section";

interface ListTemplateProps {
  title: string;
  lead?: string;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
  children?: React.ReactNode; // list/grid
}

export default function ListTemplate({ title, lead, actions, filters, children }: ListTemplateProps) {
  return (
    <>
      <PageHeader title={title} lead={lead} actions={actions} />
      {filters ? (
        <Section>
          <div className="flex flex-wrap items-center gap-3">{filters}</div>
        </Section>
      ) : null}
      <Section>
        {children}
      </Section>
    </>
  );
}
