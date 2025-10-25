"use client";

import React from "react";
import PageHeader from "@/components/layout/PageHeader";
import Section from "@/components/layout/Section";

interface DetailTemplateProps {
  title: string;
  lead?: string;
  actions?: React.ReactNode;
  hero?: React.ReactNode;
  tabs?: React.ReactNode;
  aside?: React.ReactNode;
  children?: React.ReactNode; // main content
}

export default function DetailTemplate({ title, lead, actions, hero, tabs, aside, children }: DetailTemplateProps) {
  return (
    <>
      <PageHeader title={title} lead={lead} actions={actions} />
      {hero ? (
        <Section className="pt-0 -mt-6">
          {hero}
        </Section>
      ) : null}
      {tabs ? (
        <Section>
          {tabs}
        </Section>
      ) : null}
      <Section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className={aside ? "lg:col-span-8" : "lg:col-span-12"}>{children}</div>
          {aside ? <aside className="lg:col-span-4">{aside}</aside> : null}
        </div>
      </Section>
    </>
  );
}
