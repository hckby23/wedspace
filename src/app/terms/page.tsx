"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";
import { 
  FileText, 
  Shield, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  Mail,
  Phone,
  Scale,
  Lock,
  CreditCard,
  Globe,
  UserCheck,
  Building2,
  Gavel,
  Clock
} from "lucide-react";

interface TermSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: string[];
  lastUpdated?: string;
}

const termsSections: TermSection[] = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: CheckCircle,
    content: [
      "By accessing and using WedSpace (\"we\", \"us\", \"our\"), you accept and agree to be bound by the terms and provision of this agreement.",
      "If you do not agree to abide by the above, please do not use this service.",
      "These terms apply to all users of the WedSpace platform, including couples, vendors, venues, and other service providers."
    ],
    lastUpdated: "January 15, 2024"
  },
  {
    id: "services",
    title: "Description of Services",
    icon: Building2,
    content: [
      "WedSpace is an online marketplace that connects couples planning weddings with venues, vendors, and service providers.",
      "We provide tools for wedding planning, vendor discovery, venue booking, budget management, and guest coordination.",
      "WedSpace acts as an intermediary platform and is not a party to any contracts between users and service providers.",
      "We do not guarantee the quality, safety, or legality of services offered by third-party providers."
    ]
  },
  {
    id: "accounts",
    title: "User Accounts and Registration",
    icon: UserCheck,
    content: [
      "You must create an account to access certain features of our platform.",
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You agree to provide accurate, current, and complete information during registration.",
      "You must notify us immediately of any unauthorized use of your account.",
      "We reserve the right to suspend or terminate accounts that violate these terms."
    ]
  },
  {
    id: "conduct",
    title: "User Conduct and Responsibilities",
    icon: Users,
    content: [
      "You agree to use WedSpace only for lawful purposes and in accordance with these terms.",
      "You will not post false, misleading, or fraudulent information.",
      "You will not engage in harassment, discrimination, or abusive behavior toward other users.",
      "You will not attempt to gain unauthorized access to our systems or other users' accounts.",
      "You are responsible for all content you post and activities conducted through your account."
    ]
  },
  {
    id: "payments",
    title: "Payments and Fees",
    icon: CreditCard,
    content: [
      "WedSpace may charge fees for certain services, which will be clearly disclosed before purchase.",
      "All payments are processed through secure, third-party payment processors.",
      "Refunds are subject to our refund policy and applicable terms of service providers.",
      "You are responsible for any taxes applicable to your transactions.",
      "We reserve the right to change our fee structure with 30 days' notice."
    ]
  },
  {
    id: "privacy",
    title: "Privacy and Data Protection",
    icon: Lock,
    content: [
      "Your privacy is important to us. Please review our Privacy Policy for details on data collection and use.",
      "We implement industry-standard security measures to protect your personal information.",
      "We may share information with service providers as necessary to deliver our services.",
      "You have the right to access, update, and delete your personal information.",
      "We comply with applicable data protection laws including GDPR and Indian data protection regulations."
    ]
  },
  {
    id: "intellectual",
    title: "Intellectual Property Rights",
    icon: Shield,
    content: [
      "WedSpace and its content are protected by copyright, trademark, and other intellectual property laws.",
      "You retain ownership of content you post, but grant us a license to use it for platform operations.",
      "You may not copy, modify, or distribute our proprietary content without permission.",
      "We respect intellectual property rights and will respond to valid DMCA takedown notices.",
      "Users are responsible for ensuring they have rights to any content they upload."
    ]
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    icon: AlertTriangle,
    content: [
      "WedSpace is provided \"as is\" without warranties of any kind, express or implied.",
      "We are not liable for any indirect, incidental, special, or consequential damages.",
      "Our total liability to you for any claim shall not exceed the amount you paid us in the 12 months preceding the claim.",
      "We are not responsible for the actions, content, or services of third-party vendors and venues.",
      "You use our platform at your own risk and discretion."
    ]
  },
  {
    id: "termination",
    title: "Termination",
    icon: Clock,
    content: [
      "You may terminate your account at any time by contacting our support team.",
      "We may suspend or terminate your account for violations of these terms.",
      "Upon termination, your right to use the platform ceases immediately.",
      "We may retain certain information as required by law or for legitimate business purposes.",
      "Termination does not affect any outstanding obligations or liabilities."
    ]
  },
  {
    id: "governing",
    title: "Governing Law and Jurisdiction",
    icon: Gavel,
    content: [
      "These terms are governed by the laws of India.",
      "Any disputes arising from these terms will be subject to the exclusive jurisdiction of courts in Bangalore, India.",
      "We will attempt to resolve disputes through good faith negotiations before litigation.",
      "If any provision of these terms is found unenforceable, the remaining provisions remain in effect.",
      "These terms constitute the entire agreement between you and WedSpace."
    ]
  },
  {
    id: "changes",
    title: "Changes to Terms",
    icon: Calendar,
    content: [
      "We reserve the right to modify these terms at any time.",
      "Material changes will be communicated via email or platform notifications.",
      "Continued use of the platform after changes constitutes acceptance of new terms.",
      "You should review these terms periodically for updates.",
    ]
  }
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = React.useState<string | null>(null);

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: FileText, text: "Legal" }}
        title="Terms of"
        titleGradient="Service"
        description="Please read these terms carefully before using WedSpace"
      >
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Last updated: January 15, 2024</span>
        </div>
      </EnhancedPageHero>
      <PageContainer className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {termsSections.map((section) => {
              const IconComponent = section.icon;
              return (
                <Card key={section.id} className="overflow-hidden border-0 shadow-md">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                          {section.title}
                        </h2>
                        {section.lastUpdated && (
                          <p className="text-sm text-muted-foreground">
                            Last updated: {section.lastUpdated}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      {section.content.map((paragraph, index) => (
                        <p key={index} className="text-muted-foreground leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </PageContainer>

      {/* Contact Section */}
      <PageContainer className="py-16">
        <Card className="mt-12 bg-gradient-to-r from-primary via-rose-500 to-secondary text-white border-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <CardContent className="p-8 relative">
            <div className="text-center">
              <h3 className="font-display text-2xl font-bold mb-4">Questions About Our Terms?</h3>
              <p className="opacity-90 mb-6">
                If you have any questions about these Terms of Service, please contact our legal team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Mail className="w-5 h-5 mr-2" />
                  legal@wedspace.in
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </main>
  );
}
