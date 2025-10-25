"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";
import { 
  Shield, 
  Eye, 
  Database, 
  Lock, 
  UserCheck, 
  Settings, 
  Download, 
  Trash2, 
  Mail, 
  Phone, 
  Globe, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Users, 
  Cookie, 
  Smartphone, 
  MapPin, 
  CreditCard
} from "lucide-react";

interface PrivacySection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: string[];
  important?: boolean;
}

const privacySections: PrivacySection[] = [
  {
    id: "overview",
    title: "Privacy Overview",
    icon: Shield,
    content: [
      "WedSpace is committed to protecting your privacy and personal information.",
      "This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.",
      "We comply with applicable data protection laws including GDPR, CCPA, and Indian data protection regulations.",
      "By using WedSpace, you consent to the data practices described in this policy."
    ],
    important: true
  },
  {
    id: "collection",
    title: "Information We Collect",
    icon: Database,
    content: [
      "Personal Information: Name, email address, phone number, profile photos, and wedding details.",
      "Account Information: Username, password (encrypted), preferences, and account settings.",
      "Usage Data: Pages visited, features used, search queries, and interaction patterns.",
      "Device Information: IP address, browser type, operating system, and device identifiers.",
      "Location Data: General location information to show relevant venues and vendors (with your consent).",
      "Communication Data: Messages sent through our platform, customer support interactions."
    ]
  },
  {
    id: "usage",
    title: "How We Use Your Information",
    icon: Settings,
    content: [
      "Provide and maintain our wedding planning services and platform functionality.",
      "Personalize your experience with relevant venue and vendor recommendations.",
      "Process transactions and communicate about your bookings and inquiries.",
      "Send important updates about your account, bookings, and platform changes.",
      "Improve our services through analytics and user feedback analysis.",
      "Ensure platform security and prevent fraud or unauthorized access.",
      "Comply with legal obligations and resolve disputes."
    ]
  },
  {
    id: "sharing",
    title: "Information Sharing and Disclosure",
    icon: Users,
    content: [
      "Vendors and Venues: We share relevant contact information when you make inquiries or bookings.",
      "Service Providers: Trusted third parties who help us operate our platform (payment processors, analytics, etc.).",
      "Legal Requirements: When required by law, court order, or to protect our rights and safety.",
      "Business Transfers: In case of merger, acquisition, or sale of assets (with user notification).",
      "Consent: Any other sharing requires your explicit consent.",
      "We never sell your personal information to third parties for marketing purposes."
    ]
  },
  {
    id: "security",
    title: "Data Security and Protection",
    icon: Lock,
    content: [
      "We implement industry-standard security measures to protect your personal information.",
      "All data transmission is encrypted using SSL/TLS protocols.",
      "Passwords are encrypted and stored securely using advanced hashing algorithms.",
      "Regular security audits and vulnerability assessments are conducted.",
      "Access to personal data is restricted to authorized personnel only.",
      "We maintain incident response procedures for potential data breaches."
    ]
  },
  {
    id: "cookies",
    title: "Cookies and Tracking Technologies",
    icon: Cookie,
    content: [
      "We use cookies and similar technologies to enhance your browsing experience.",
      "Essential cookies are necessary for basic platform functionality.",
      "Analytics cookies help us understand how users interact with our platform.",
      "Preference cookies remember your settings and customizations.",
      "You can control cookie preferences through your browser settings.",
      "Some features may not work properly if cookies are disabled."
    ]
  },
  {
    id: "rights",
    title: "Your Privacy Rights",
    icon: UserCheck,
    content: [
      "Access: Request a copy of the personal information we hold about you.",
      "Correction: Update or correct inaccurate personal information.",
      "Deletion: Request deletion of your personal information (subject to legal requirements).",
      "Portability: Receive your data in a structured, machine-readable format.",
      "Restriction: Limit how we process your personal information.",
      "Objection: Object to processing based on legitimate interests.",
      "Withdraw Consent: Withdraw consent for data processing at any time."
    ],
    important: true
  },
  {
    id: "retention",
    title: "Data Retention",
    icon: Calendar,
    content: [
      "We retain personal information only as long as necessary for the purposes outlined in this policy.",
      "Account information is retained while your account is active and for a reasonable period after closure.",
      "Transaction records are kept for legal and accounting requirements (typically 7 years).",
      "Marketing communications data is retained until you unsubscribe.",
      "Some information may be retained longer if required by law or for legitimate business purposes."
    ]
  },
  {
    id: "international",
    title: "International Data Transfers",
    icon: Globe,
    content: [
      "Your information may be transferred to and processed in countries other than your own.",
      "We ensure adequate protection through appropriate safeguards and legal mechanisms.",
      "Data transfers comply with applicable data protection laws and regulations.",
      "We use standard contractual clauses and other approved transfer mechanisms."
    ]
  },
  {
    id: "children",
    title: "Children's Privacy",
    icon: Shield,
    content: [
      "Our services are not intended for children under 18 years of age.",
      "We do not knowingly collect personal information from children under 18.",
      "If we become aware of such collection, we will delete the information promptly.",
      "Parents or guardians should monitor their children's online activities."
    ]
  },
  {
    id: "changes",
    title: "Policy Updates",
    icon: FileText,
    content: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices.",
      "Material changes will be communicated via email or prominent platform notifications.",
      "The updated policy will include the effective date of changes.",
      "Continued use of our services after changes constitutes acceptance of the updated policy.",
      "We encourage you to review this policy periodically."
    ]
  }
];

const dataTypes = [
  { icon: UserCheck, label: "Personal Info", description: "Name, email, phone" },
  { icon: MapPin, label: "Location", description: "City, venue preferences" },
  { icon: Eye, label: "Usage Data", description: "Pages viewed, searches" },
  { icon: Smartphone, label: "Device Info", description: "Browser, IP address" },
  { icon: Mail, label: "Communications", description: "Messages, support tickets" }
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Shield, text: "Privacy" }}
        title="Privacy"
        titleGradient="Policy"
        description="Your privacy is important to us. Learn how we protect your data."
      >
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Last updated: January 15, 2024</span>
        </div>
      </EnhancedPageHero>
      <PageContainer className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {privacySections.map((section, index) => (
              <Card 
                key={section.id} 
                className={`border-0 shadow-md hover:shadow-xl transition-all duration-300 ${
                  section.important ? 'ring-2 ring-primary' : ''
                }`}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h2 className="font-display text-2xl font-bold text-foreground">
                          {index + 1}. {section.title}
                        </h2>
                        {section.important && (
                          <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-semibold">
                            Important
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        {section.content.map((paragraph, pIndex) => (
                          <p key={pIndex} className="text-muted-foreground leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
