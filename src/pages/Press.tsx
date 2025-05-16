
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail } from 'lucide-react';

const Press: React.FC = () => {
  // Mock press releases
  const pressReleases = [
    {
      id: 1,
      title: "wedspace Raises $20 Million in Series A Funding",
      date: "April 15, 2025",
      summary: "Wedding planning platform secures major investment to expand services nationwide and enhance vendor marketplace.",
      link: "#"
    },
    {
      id: 2,
      title: "wedspace Launches New AI Wedding Planning Assistant",
      date: "March 22, 2025",
      summary: "Revolutionary AI tool helps couples navigate wedding planning decisions with personalized recommendations.",
      link: "#"
    },
    {
      id: 3,
      title: "wedspace Surpasses 100,000 Vendor Partners Nationwide",
      date: "February 8, 2025",
      summary: "Leading wedding platform celebrates milestone with special promotions for couples planning their special day.",
      link: "#"
    },
    {
      id: 4,
      title: "wedspace Named Top Wedding Tech Startup of 2025",
      date: "January 19, 2025",
      summary: "Wedding Industry Association recognizes wedspace for innovation in connecting couples with venues and vendors.",
      link: "#"
    }
  ];
  
  // Mock media coverage
  const mediaCoverage = [
    {
      id: 1,
      outlet: "The New York Times",
      title: "How Technology is Transforming Wedding Planning",
      date: "April 3, 2025",
      quote: "wedspace has emerged as the leading platform connecting couples with venues and vendors, streamlining what was once a stressful process.",
      link: "#"
    },
    {
      id: 2,
      outlet: "TechCrunch",
      title: "Wedding Tech Startup wedspace Disrupts Traditional Planning",
      date: "March 14, 2025",
      quote: "With innovative tools and a vast marketplace of vendors, wedspace is redefining how couples approach their wedding day preparation.",
      link: "#"
    },
    {
      id: 3,
      outlet: "Wedding Wire",
      title: "Top 10 Wedding Planning Apps for 2025",
      date: "February 27, 2025",
      quote: "wedspace takes our top spot for its comprehensive suite of planning tools and its expansive network of verified vendors.",
      link: "#"
    },
    {
      id: 4,
      outlet: "Forbes",
      title: "Meet the Entrepreneurs Behind Wedding Tech's Biggest Success",
      date: "January 30, 2025",
      quote: "The founders of wedspace identified a fragmented industry and built a platform that brings together all aspects of wedding planning into one seamless experience.",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-space/10 to-wed/10 py-12">
          <div className="container-custom">
            <div className="max-w-4xl">
              <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">Press & Media</h1>
              <p className="text-gray-600 max-w-2xl mb-6">
                Find the latest news, press releases, and media resources about wedspace. For press inquiries, please contact our media relations team.
              </p>
              <Button 
                className="bg-wed hover:bg-wed/90 flex items-center gap-2"
                onClick={() => window.location.href = "mailto:press@wedspace.com"}
              >
                <Mail size={16} />
                Contact Press Team
              </Button>
            </div>
          </div>
        </div>
        
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Press Releases */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="font-playfair text-2xl font-semibold mb-6">Latest Press Releases</h2>
                <div className="space-y-6">
                  {pressReleases.map((release) => (
                    <Card key={release.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="text-sm text-gray-500 mb-2">{release.date}</div>
                      <h3 className="font-playfair text-xl font-medium mb-3">{release.title}</h3>
                      <p className="text-gray-600 mb-4">{release.summary}</p>
                      <Button variant="outline" className="text-wed hover:text-wed/90 hover:border-wed">
                        Read Full Press Release
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* Media Coverage */}
              <div>
                <h2 className="font-playfair text-2xl font-semibold mb-6">Media Coverage</h2>
                <div className="space-y-6">
                  {mediaCoverage.map((coverage) => (
                    <Card key={coverage.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold">{coverage.outlet}</span>
                        <span className="text-sm text-gray-500">{coverage.date}</span>
                      </div>
                      <h3 className="font-playfair text-xl font-medium mb-3">{coverage.title}</h3>
                      <blockquote className="border-l-4 border-wed/20 pl-4 italic text-gray-600 mb-4">
                        "{coverage.quote}"
                      </blockquote>
                      <Button variant="outline" className="text-wed hover:text-wed/90 hover:border-wed">
                        Read Article
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Media Resources Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 mb-8">
                <h3 className="font-playfair text-xl font-semibold mb-4">Media Kit</h3>
                <p className="text-gray-600 mb-4">Access our media kit with logos, brand guidelines, executive photos, and fact sheets.</p>
                <Button className="w-full bg-space hover:bg-space/90 mb-2">
                  Download Media Kit
                </Button>
                <p className="text-sm text-gray-500 mt-2">Last updated: April 2025</p>
              </Card>
              
              <Card className="p-6 mb-8">
                <h3 className="font-playfair text-xl font-semibold mb-4">Company Facts</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-space/10 text-space font-medium px-3 py-1 rounded-full text-xs mr-3 mt-1">Founded</div>
                    <div>2022 in San Francisco, California</div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-space/10 text-space font-medium px-3 py-1 rounded-full text-xs mr-3 mt-1">Founders</div>
                    <div>Jane Smith, CEO<br />Michael Johnson, CTO</div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-space/10 text-space font-medium px-3 py-1 rounded-full text-xs mr-3 mt-1">Funding</div>
                    <div>$27 million in total funding</div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-space/10 text-space font-medium px-3 py-1 rounded-full text-xs mr-3 mt-1">Users</div>
                    <div>500,000+ couples<br />100,000+ vendors</div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-space/10 text-space font-medium px-3 py-1 rounded-full text-xs mr-3 mt-1">Coverage</div>
                    <div>Available in all 50 U.S. states</div>
                  </li>
                </ul>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-playfair text-xl font-semibold mb-4">Press Contact</h3>
                <p className="text-gray-600 mb-4">For press inquiries, please contact:</p>
                <div className="space-y-2 mb-4">
                  <p className="font-medium">Sarah Williams</p>
                  <p>Head of Communications</p>
                  <p>press@wedspace.com</p>
                  <p>(555) 789-1234</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = "mailto:press@wedspace.com"}
                >
                  Email Press Team
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Press;
