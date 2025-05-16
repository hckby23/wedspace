
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-12">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: April 23, 2025
            </p>
            
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-playfair font-semibold">1. Introduction</h2>
                <p>Welcome to the privacy policy of wedspace ("we", "us", or "our"). This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.wedspace.com or use our mobile application (collectively, the "Platform").</p>
                <p>We respect your privacy and are committed to protecting personally identifiable information you may provide us through the Platform. We have adopted this privacy policy ("Privacy Policy") to explain what information may be collected on our Platform, how we use this information, and under what circumstances we may disclose the information to third parties.</p>
                <p>This Privacy Policy applies only to information we collect through the Platform and does not apply to our collection of information from other sources.</p>
                <p>Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Platform. By accessing or using our Platform, you agree to this Privacy Policy.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">2. Information We Collect</h2>
                <p>We collect information that you provide directly to us. This may include:</p>
                <ul className="list-disc pl-6 my-4">
                  <li><strong>Personal Information:</strong> When you create an account, we collect your name, email address, password, and other information you choose to provide.</li>
                  <li><strong>Profile Information:</strong> We collect information you provide in your user profile, such as your phone number, address, wedding date, and preferences.</li>
                  <li><strong>Vendor Information:</strong> If you register as a vendor, we collect your business name, business type, description, contact information, service details, pricing, availability, and other information relevant to your business.</li>
                  <li><strong>Transaction Information:</strong> If you make a purchase through our Platform, we collect payment information, billing details, and other information necessary to process your transaction.</li>
                  <li><strong>Communications:</strong> We collect information when you communicate with us or with other users through our Platform, including messages and reviews.</li>
                </ul>
                
                <p>We also automatically collect certain information when you visit, use, or navigate our Platform. This information does not reveal your specific identity but may include:</p>
                <ul className="list-disc pl-6 my-4">
                  <li><strong>Device Information:</strong> We collect device information such as your IP address, browser type, operating system, and other technologies on the devices you use to access the Platform.</li>
                  <li><strong>Usage Information:</strong> We collect information related to your actions on our Platform, including pages visited, time spent on those pages, and other statistics.</li>
                  <li><strong>Location Information:</strong> We may collect your location information from your device if you grant us permission to do so.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">3. How We Use Your Information</h2>
                <p>We may use the information we collect for various purposes, including to:</p>
                <ul className="list-disc pl-6 my-4">
                  <li>Create and maintain your account</li>
                  <li>Process your transactions and send you related information</li>
                  <li>Provide, maintain, and improve our Platform</li>
                  <li>Personalize your experience and deliver content relevant to your interests</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Send you technical notices, updates, security alerts, and administrative messages</li>
                  <li>Communicate with you about products, services, offers, promotions, and events</li>
                  <li>Monitor and analyze trends, usage, and activities in connection with our Platform</li>
                  <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">4. Sharing Your Information</h2>
                <p>We may share your information in the following situations:</p>
                <ul className="list-disc pl-6 my-4">
                  <li><strong>With Vendors and Service Providers:</strong> We may share your information with vendors and service providers who perform services for us or on our behalf.</li>
                  <li><strong>With Business Partners:</strong> We may share your information with our business partners to offer you certain products, services, or promotions.</li>
                  <li><strong>With Other Users:</strong> When you share information or interact with other users on our Platform, such information may be viewed by all users and may be publicly made available outside the Platform.</li>
                  <li><strong>With Your Consent:</strong> We may disclose your information for any other purpose with your consent.</li>
                  <li><strong>For Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                  <li><strong>For Legal Compliance:</strong> We may disclose your information where required to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
                  <li><strong>To Protect Rights:</strong> We may disclose your information to protect the rights, property, or safety of wedspace, our users, or others.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">5. Your Privacy Choices</h2>
                <p>You have several choices regarding your personal information:</p>
                <ul className="list-disc pl-6 my-4">
                  <li><strong>Account Information:</strong> You can update your account information by logging into your account settings.</li>
                  <li><strong>Marketing Communications:</strong> You can opt out of receiving marketing emails from us by following the unsubscribe instructions in those emails.</li>
                  <li><strong>Cookies:</strong> Most web browsers are set to accept cookies by default. You can choose to set your browser to remove or reject cookies.</li>
                  <li><strong>Location Information:</strong> You can prevent us from collecting location information by denying permission in your device settings.</li>
                  <li><strong>Do Not Track:</strong> Currently, our systems do not recognize browser "do-not-track" requests.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">6. Data Security</h2>
                <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">7. Children's Privacy</h2>
                <p>Our Platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and you believe your child has provided us with personal information, please contact us.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">8. California Privacy Rights</h2>
                <p>California Civil Code Section 1798.83 permits users of our Platform who are California residents to request certain information regarding our disclosure of personal information to third parties for their direct marketing purposes.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">9. Privacy Policy Updates</h2>
                <p>We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date and the updated version will be effective as soon as it is accessible. We encourage you to review this Privacy Policy frequently to be informed of how we are protecting your information.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">10. Contact Us</h2>
                <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
                <p className="mt-4">
                  wedspace<br />
                  123 Wedding Lane<br />
                  San Francisco, CA 94107<br />
                  Email: privacy@wedspace.com<br />
                  Phone: (555) 123-4567
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
