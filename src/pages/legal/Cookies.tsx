
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Cookies: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-12">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Cookie Policy</h1>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: April 23, 2025
            </p>
            
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-playfair font-semibold">1. Introduction</h2>
                <p>This Cookie Policy explains how wedspace ("we", "us", or "our") uses cookies and similar technologies to recognize you when you visit our website at www.wedspace.com or use our mobile application (collectively, the "Platform"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.</p>
                <p>In some cases, we may use cookies to collect personal information, or that becomes personal information if we combine it with other information.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">2. What are Cookies?</h2>
                <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
                <p>Cookies set by the website owner (in this case, wedspace) are called "first party cookies". Cookies set by parties other than the website owner are called "third party cookies". Third party cookies enable third party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">3. Why Do We Use Cookies?</h2>
                <p>We use first and third party cookies for several reasons. Some cookies are required for technical reasons in order for our Platform to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Platform for advertising, analytics, and other purposes.</p>
                <p>The specific types of first and third party cookies served through our Platform and the purposes they perform are described below:</p>
                
                <h3 className="text-xl font-playfair font-medium mt-6">Essential Cookies</h3>
                <p>These cookies are strictly necessary to provide you with services available through our Platform and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the Platform, you cannot refuse them without impacting how our Platform functions.</p>
                
                <h3 className="text-xl font-playfair font-medium mt-6">Performance and Functionality Cookies</h3>
                <p>These cookies are used to enhance the performance and functionality of our Platform but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.</p>
                
                <h3 className="text-xl font-playfair font-medium mt-6">Analytics and Customization Cookies</h3>
                <p>These cookies collect information that is used either in aggregate form to help us understand how our Platform is being used or how effective our marketing campaigns are, or to help us customize our Platform for you. If you do not allow these cookies, we will not know when you have visited our site.</p>
                
                <h3 className="text-xl font-playfair font-medium mt-6">Advertising Cookies</h3>
                <p>These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">4. How Can You Control Cookies?</h2>
                <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by following the instructions provided in our Cookie Banner when you first visit our Platform.</p>
                <p>You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, you should visit your browser's help menu for more information.</p>
                <p>In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like to find out more information, please visit <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-wed hover:underline">http://www.aboutads.info/choices/</a> or <a href="http://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-wed hover:underline">http://www.youronlinechoices.com</a>.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">5. Cookies We Use</h2>
                <p>The specific types of cookies served through our Platform and the purposes they perform are described in the table below:</p>
                
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cookie Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_session</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Used to maintain user session state</td>
                        <td className="px-6 py-4 text-sm text-gray-500">wedspace.com</td>
                        <td className="px-6 py-4 text-sm text-gray-500">2 weeks</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_auth</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Used to authenticate users</td>
                        <td className="px-6 py-4 text-sm text-gray-500">wedspace.com</td>
                        <td className="px-6 py-4 text-sm text-gray-500">30 days</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_preferences</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Stores user preferences</td>
                        <td className="px-6 py-4 text-sm text-gray-500">wedspace.com</td>
                        <td className="px-6 py-4 text-sm text-gray-500">1 year</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_ga</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Used to distinguish users for analytics</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Google Analytics</td>
                        <td className="px-6 py-4 text-sm text-gray-500">2 years</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_fbp</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Used by Facebook for advertising purposes</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Facebook</td>
                        <td className="px-6 py-4 text-sm text-gray-500">3 months</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">6. Other Tracking Technologies</h2>
                <p>Cookies are not the only way to recognize or track visitors to a website. We may use other, similar technologies from time to time, like web beacons (sometimes called "tracking pixels" or "clear gifs"). These are tiny graphics files that contain a unique identifier that enable us to recognize when someone has visited our Platform or opened an e-mail including them. This allows us, for example, to monitor the traffic patterns of users from one page within a website to another, to deliver or communicate with cookies, to understand whether you have come to the website from an online advertisement displayed on a third-party website, to improve site performance, and to measure the success of e-mail marketing campaigns. In many instances, these technologies are reliant on cookies to function properly, and so declining cookies will impair their functioning.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">7. Updates to this Cookie Policy</h2>
                <p>We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.</p>
                <p>The date at the top of this Cookie Policy indicates when it was last updated.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-playfair font-semibold">8. Contact Us</h2>
                <p>If you have any questions about our use of cookies or other technologies, please contact us at:</p>
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

export default Cookies;
