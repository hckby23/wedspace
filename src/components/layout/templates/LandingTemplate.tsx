"use client";

import React from "react";
import PageHeader from "@/components/layout/PageHeader";
import Section from "@/components/layout/Section";

interface LandingTemplateProps {
  title: string;
  lead?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export default function LandingTemplate({ title, lead, actions, children }: LandingTemplateProps) {
  return (
    <>
      <PageHeader title={title} lead={lead} actions={actions} />
      <Section>{children}</Section>
    </>
  );
}
