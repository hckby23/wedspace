"use client";

import React from "react";
import PageHeader from "@/components/layout/PageHeader";
import Section from "@/components/layout/Section";

interface UtilityTemplateProps {
  title: string;
  lead?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export default function UtilityTemplate({ title, lead, actions, children }: UtilityTemplateProps) {
  return (
    <>
      <PageHeader title={title} lead={lead} actions={actions} />
      <Section>
        {children}
      </Section>
    </>
  );
}
