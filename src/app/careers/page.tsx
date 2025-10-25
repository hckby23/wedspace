"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";
import { 
  Users, 
  MapPin, 
  Clock, 
  Briefcase, 
  Heart, 
  Star, 
  Award, 
  TrendingUp, 
  Zap, 
  Coffee, 
  Laptop, 
  Globe, 
  CheckCircle, 
  ArrowRight, 
  Mail, 
  Phone,
  Building2,
  Target,
  Rocket,
  Crown,
  Sparkles,
  Calendar,
  DollarSign,
  Camera,
  Code,
  Palette,
  BarChart3,
  MessageSquare,
  Shield
} from "lucide-react";

export default function CareersPage() {
  const roles = [
    { title: "Frontend Engineer (Next.js)", location: "Remote / India", type: "Contract" },
    { title: "UI/UX Designer", location: "Remote / India", type: "Contract" },
    { title: "Vendor Success Lead", location: "Delhi NCR", type: "Part-time" },
  ];
  
  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Briefcase, text: "Join Our Team" }}
        title="Build the Future of"
        titleGradient="Wedding Planning"
        description="Join us in building India's most trusted, intelligent, and seamless wedding platform."
      />

      <PageContainer className="py-12">
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Open Positions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((r) => (
              <Card key={r.title} className="p-6 border-0 shadow-md hover:shadow-xl transition-all">
                <h3 className="font-display text-lg font-semibold text-foreground">{r.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{r.location} • {r.type}</p>
                <div className="mt-4">
                  <Button className="bg-gradient-to-r from-primary via-rose-500 to-secondary text-white">Apply Now</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-2xl mx-auto">
          <Card className="p-6 border-0 shadow-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Email Us</h3>
                <p className="text-muted-foreground">careers@wedspace.in</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-0 shadow-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Phone className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Call Us</h3>
                <p className="text-muted-foreground">+91 98765 43210</p>
              </div>
            </div>
          </Card>
        </div>
      </PageContainer>
    </main>
  );
}
