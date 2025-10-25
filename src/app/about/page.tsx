"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";
import Link from "next/link";
import {
  Heart,
  Users,
  MapPin,
  Award,
  Sparkles,
  Shield,
  Globe,
  ArrowRight
} from "lucide-react";

const stats = [
  { label: 'Happy Couples', value: '10,000+', icon: Heart },
  { label: 'Verified Vendors', value: '1,000+', icon: Award },
  { label: 'Cities Covered', value: '15+', icon: Globe }
];

const values = [
  {
    icon: Heart,
    title: 'Love-Centered',
    description: 'Every decision we make is guided by celebrating love and creating magical moments for couples.'
  },
  {
    icon: Shield,
    title: 'Trust & Transparency',
    description: 'We verify every vendor and maintain complete transparency in pricing.'
  },
  {
    icon: Sparkles,
    title: 'Innovation First',
    description: 'Leveraging AI and modern technology to make wedding planning effortless.'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Building a supportive community where couples and vendors grow together.'
  }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Sparkles, text: "About Us" }}
        title="Making Dream Weddings"
        titleGradient="A Reality"
        description="We're building India's most trusted wedding planning platform, powered by AI and driven by love."
      />

      <PageContainer className="py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-md text-center">
                <CardContent className="p-8">
                  <IconComponent className="w-12 h-12 text-primary mx-auto mb-4" />
                  <div className="text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Mission */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            To simplify wedding planning for every couple in India by connecting them with the best venues and vendors, powered by intelligent technology and backed by exceptional service.
          </p>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="border-0 shadow-md hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary via-rose-500 to-secondary rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-white" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Planning?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of couples who've planned their perfect wedding with WedSpace
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/venues">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  Explore Venues
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/vendors">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Browse Vendors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
