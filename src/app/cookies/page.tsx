"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";
import { 
  Cookie, 
  Settings, 
  Shield, 
  BarChart3, 
  Target, 
  CheckCircle, 
  X, 
  Eye, 
  Lock, 
  Globe, 
  Calendar, 
  FileText, 
  ToggleLeft, 
  ToggleRight, 
  Info, 
  AlertTriangle, 
  Download, 
  Mail, 
  Phone
} from "lucide-react";

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  essential: boolean;
  enabled: boolean;
  cookies: {
    name: string;
    purpose: string;
    duration: string;
    provider: string;
  }[];
}

const cookieCategories: CookieCategory[] = [
  {
    id: "essential",
    name: "Essential Cookies",
    description: "These cookies are necessary for the website to function and cannot be switched off.",
    icon: Shield,
    essential: true,
    enabled: true,
    cookies: [
      {
        name: "session_id",
        purpose: "Maintains your login session and security",
        duration: "Session",
        provider: "WedSpace"
      },
      {
        name: "csrf_token",
        purpose: "Protects against cross-site request forgery attacks",
        duration: "Session",
        provider: "WedSpace"
      },
      {
        name: "cookie_consent",
        purpose: "Remembers your cookie preferences",
        duration: "1 year",
        provider: "WedSpace"
      }
    ]
  },
  {
    id: "functional",
    name: "Functional Cookies",
    description: "These cookies enable enhanced functionality and personalization.",
    icon: Settings,
    essential: false,
    enabled: true,
    cookies: [
      {
        name: "user_preferences",
        purpose: "Stores your display preferences and settings",
        duration: "1 year",
        provider: "WedSpace"
      },
      {
        name: "theme_mode",
        purpose: "Remembers your dark/light mode preference",
        duration: "1 year",
        provider: "WedSpace"
      },
      {
        name: "search_filters",
        purpose: "Saves your search filters and preferences",
        duration: "30 days",
        provider: "WedSpace"
      }
    ]
  },
  {
    id: "analytics",
    name: "Analytics Cookies",
    description: "These cookies help us understand how visitors interact with our website.",
    icon: BarChart3,
    essential: false,
    enabled: true,
    cookies: [
      {
        name: "_ga",
        purpose: "Distinguishes unique users and sessions",
        duration: "2 years",
        provider: "Google Analytics"
      },
      {
        name: "_ga_*",
        purpose: "Contains campaign-related information",
        duration: "2 years",
        provider: "Google Analytics"
      },
      {
        name: "mixpanel_*",
        purpose: "Tracks user interactions and events",
        duration: "1 year",
        provider: "Mixpanel"
      }
    ]
  },
  {
    id: "marketing",
    name: "Marketing Cookies",
    description: "These cookies are used to deliver relevant advertisements and track campaign performance.",
    icon: Target,
    essential: false,
    enabled: false,
    cookies: [
      {
        name: "_fbp",
        purpose: "Facebook pixel for conversion tracking",
        duration: "3 months",
        provider: "Facebook"
      },
      {
        name: "_gcl_au",
        purpose: "Google Ads conversion tracking",
        duration: "3 months",
        provider: "Google Ads"
      },
      {
        name: "utm_*",
        purpose: "Tracks marketing campaign performance",
        duration: "30 days",
        provider: "WedSpace"
      }
    ]
  }
];

export default function CookiesPage() {
  const [cookieSettings, setCookieSettings] = React.useState<CookieCategory[]>(cookieCategories);
  const [showSettings, setShowSettings] = React.useState(false);

  const toggleCategory = (categoryId: string) => {
    setCookieSettings(prev => 
      prev.map(category => 
        category.id === categoryId && !category.essential
          ? { ...category, enabled: !category.enabled }
          : category
      )
    );
  };

  const acceptAll = () => {
    setCookieSettings(prev => 
      prev.map(category => ({ ...category, enabled: true }))
    );
    window.alert("All cookies accepted! Your preferences have been saved.");
  };

  const acceptEssential = () => {
    setCookieSettings(prev => 
      prev.map(category => ({ 
        ...category, 
        enabled: category.essential 
      }))
    );
    window.alert("Essential cookies only! Your preferences have been saved.");
  };

  const saveSettings = () => {
    window.alert("Cookie preferences saved successfully!");
    setShowSettings(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Cookie, text: "Privacy" }}
        title="Cookie"
        titleGradient="Policy"
        description="Understand how we use cookies to improve your experience"
      />

      <PageContainer className="py-12">
        <div className="max-w-4xl mx-auto">
          {/* Cookie Overview */}
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-3xl font-bold text-gray-900 dark:text-white mb-4">
                What Are Cookies?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Cookies are small text files that are stored on your device when you visit our website
              </p>
            </div>
            

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
                    Enhance Experience
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Remember your preferences and provide personalized content
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
                    Improve Services
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Analyze usage patterns to enhance our platform and features
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
                    Ensure Security
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Maintain session security and protect against fraud
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Types of Cookies We Use
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                We use different types of cookies for various purposes on our platform
              </p>
            </div>

            <div className="space-y-6">
              {cookieSettings.map((category) => (
                <Card 
                  key={category.id} 
                  className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 ${
                    category.essential ? 'ring-2 ring-green-500 dark:ring-green-400' : ''
                  }`}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex items-start gap-6 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <category.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-playfair text-xl font-bold text-gray-900 dark:text-white">
                              {category.name}
                            </h3>
                            {category.essential && (
                              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-semibold">
                                Required
                              </div>
                            )}
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {category.description}
                          </p>
                          
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Cookies in this category:</h4>
                            {category.cookies.map((cookie, index) => (
                              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900 dark:text-white">{cookie.name}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300">{cookie.purpose}</div>
                                  </div>
                                  <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span><strong>Duration:</strong> {cookie.duration}</span>
                                    <span><strong>Provider:</strong> {cookie.provider}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCategory(category.id)}
                          disabled={category.essential}
                          className="p-2"
                        >
                          {category.enabled ? (
                            <ToggleRight className="w-8 h-8 text-green-600" />
                          ) : (
                            <ToggleLeft className="w-8 h-8 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-playfair text-2xl font-bold text-gray-900 dark:text-white">
                  Cookie Preferences
                </h3>
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(false)}
                  className="border-gray-300 dark:border-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {cookieSettings.map((category) => (
                  <div key={category.id} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <category.icon className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {category.name}
                        </h4>
                        {category.essential && (
                          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-semibold">
                            Required
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCategory(category.id)}
                        disabled={category.essential}
                        className="p-1"
                      >
                        {category.enabled ? (
                          <ToggleRight className="w-6 h-6 text-green-600" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {category.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-8">
                <Button 
                  onClick={acceptEssential}
                  variant="outline" 
                  className="flex-1"
                >
                  Essential Only
                </Button>
                <Button 
                  onClick={acceptAll}
                  variant="outline" 
                  className="flex-1"
                >
                  Accept All
                </Button>
                <Button 
                  onClick={saveSettings}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Managing Cookies */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Managing Your Cookie Preferences
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                You have full control over which cookies we use on your device
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-amber-600 rounded-lg flex items-center justify-center">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-playfair text-xl font-bold text-gray-900 dark:text-white">
                      Browser Settings
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    You can control cookies through your browser settings. Most browsers allow you to:
                  </p>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span>Block all cookies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span>Block third-party cookies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span>Delete existing cookies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span>Get notified before cookies are set</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-amber-600 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-playfair text-xl font-bold text-gray-900 dark:text-white">
                      Important Note
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Disabling certain cookies may impact your experience on WedSpace:
                  </p>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Some features may not work properly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>You may need to re-enter information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Personalization will be limited</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Security features may be affected</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-red-600 to-amber-600 rounded-2xl p-12 text-white text-center">
              <Cookie className="w-16 h-16 mx-auto mb-6" />
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
                Questions About Cookies?
              </h2>
              <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
                If you have any questions about our use of cookies, please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 shadow-lg">
                  <Mail className="w-5 h-5 mr-2" />
                  cookies@wedspace.in
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Phone className="w-5 h-5 mr-2" />
                  +91 80 4567 8903
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  </main>
);
}
