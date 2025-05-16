
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

interface SocialMediaLinksProps {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  onSave: (links: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  }) => void;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({
  facebook = '',
  instagram = '',
  twitter = '',
  linkedin = '',
  onSave,
}) => {
  const [links, setLinks] = React.useState({
    facebook,
    instagram,
    twitter,
    linkedin,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLinks((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(links);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium">Connect Social Media</h3>
      <p className="text-sm text-gray-500">
        Add your social media profiles to increase visibility and engagement.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Facebook className="h-5 w-5 text-blue-600" />
          <div className="flex-1">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              name="facebook"
              placeholder="https://facebook.com/yourbusiness"
              value={links.facebook}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Instagram className="h-5 w-5 text-pink-600" />
          <div className="flex-1">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              name="instagram"
              placeholder="https://instagram.com/yourbusiness"
              value={links.instagram}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Twitter className="h-5 w-5 text-blue-400" />
          <div className="flex-1">
            <Label htmlFor="twitter">X / Twitter</Label>
            <Input
              id="twitter"
              name="twitter"
              placeholder="https://twitter.com/yourbusiness"
              value={links.twitter}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Linkedin className="h-5 w-5 text-blue-700" />
          <div className="flex-1">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              name="linkedin"
              placeholder="https://linkedin.com/company/yourbusiness"
              value={links.linkedin}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      
      <Button type="submit" className="bg-wed hover:bg-wed/90">Save Social Links</Button>
    </form>
  );
};

export default SocialMediaLinks;
