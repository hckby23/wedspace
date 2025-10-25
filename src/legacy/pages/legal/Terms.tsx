
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-12">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: April 23, 2025
            </p>
            
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-playfair font-semibold">1. Introduction</h2>
                <p>Welcome to wedspace ("Company", "we", "our", "us"). These Terms of Service ("Terms", "Terms of Service") govern your use of our website located at www.wedspace.com (together or individually "Service") operated by wedspace.</p>
                <p>Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages.</p>
                <p>Your agreement with us includes these Terms and our Privacy Policy ("Agreements"). You acknowledge that you have read and understood Agreements, and agree to be bound by them.</p>
                <p>If you do not agree with (or cannot comply with) Agreements, then you may not use the Service, but please let us know by emailing at support@wedspace.com so we can try to find a solution. These Terms apply to all visitors, users and others who wish to access or use Service.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">2. Communications</h2>
                <p>By using our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or by emailing at support@wedspace.com.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">3. Purchases</h2>
                <p>If you wish to purchase any product or service made available through Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.</p>
                <p>You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.</p>
                <p>We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order or other reasons.</p>
                <p>We reserve the right to refuse or cancel your order if fraud or an unauthorized or illegal transaction is suspected.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">4. Contests, Sweepstakes and Promotions</h2>
                <p>Any contests, sweepstakes or other promotions (collectively, "Promotions") made available through Service may be governed by rules that are separate from these Terms of Service. If you participate in any Promotions, please review the applicable rules as well as our Privacy Policy. If the rules for a Promotion conflict with these Terms of Service, Promotion rules will apply.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">5. Refunds</h2>
                <p>We issue refunds for Contracts within 30 days of the original purchase of the Contract.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">6. Content</h2>
                <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for Content that you post on or through Service, including its legality, reliability, and appropriateness.</p>
                <p>By posting Content on or through Service, You represent and warrant that: (i) Content is yours (you own it) and/or you have the right to use it and the right to grant us the rights and license as provided in these Terms, and (ii) that the posting of your Content on or through Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person or entity. We reserve the right to terminate the account of anyone found to be infringing on a copyright.</p>
                <p>You retain any and all of your rights to any Content you submit, post or display on or through Service and you are responsible for protecting those rights. We take no responsibility and assume no liability for Content you or any third party posts on or through Service. However, by posting Content using Service you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through Service.</p>
                <p>wedspace has the right but not the obligation to monitor and edit all Content provided by users.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">7. Prohibited Uses</h2>
                <p>You may use Service only for lawful purposes and in accordance with Terms. You agree not to use Service:</p>
                <ul className="list-disc pl-6 my-4">
                  <li>In any way that violates any applicable national or international law or regulation.</li>
                  <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.</li>
                  <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
                  <li>To impersonate or attempt to impersonate Company, a Company employee, another user, or any other person or entity.</li>
                  <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful, or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity.</li>
                  <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of Service, or which, as determined by us, may harm or offend Company or users of Service or expose them to liability.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">8. Analytics</h2>
                <p>We may use third-party Service Providers to monitor and analyze the use of our Service.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">9. Intellectual Property</h2>
                <p>Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of wedspace and its licensors. Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of wedspace.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">10. Copyright Policy</h2>
                <p>We respect the intellectual property rights of others. It is our policy to respond to any claim that Content posted on Service infringes on the copyright or other intellectual property rights ("Infringement") of any person or entity.</p>
                <p>If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement, please submit your claim via email to dmca@wedspace.com, with the subject line: "Copyright Infringement" and include in your claim a detailed description of the alleged Infringement.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">11. Termination</h2>
                <p>We may terminate or suspend your account and bar access to Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of Terms.</p>
                <p>If you wish to terminate your account, you may simply discontinue using Service.</p>
                <p>All provisions of Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">12. Governing Law</h2>
                <p>These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.</p>
                <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service and supersede and replace any prior agreements we might have had between us regarding Service.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">13. Changes to Service</h2>
                <p>We reserve the right to withdraw or amend our Service, and any service or material we provide via Service, in our sole discretion without notice. We will not be liable if for any reason all or any part of Service is unavailable at any time or for any period. From time to time, we may restrict access to some parts of Service, or the entire Service, to users, including registered users.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">14. Changes to Terms</h2>
                <p>We may revise these Terms at any time by updating this page. By using our Service you are agreeing to be bound by the current version of these Terms of Service.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">15. Contact Us</h2>
                <p>If you have any questions about these Terms, please contact us at legal@wedspace.com or by mail at 123 Wedding Lane, San Francisco, CA 94107.</p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
