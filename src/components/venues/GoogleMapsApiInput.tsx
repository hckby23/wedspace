
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ExternalLink } from 'lucide-react';

interface GoogleMapsApiInputProps {
  onApiKeySet: (apiKey: string) => void;
}

const GoogleMapsApiInput: React.FC<GoogleMapsApiInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if API key exists in localStorage
    const savedApiKey = localStorage.getItem('googleMapsApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      onApiKeySet(savedApiKey);
    }
  }, [onApiKeySet]);
  
  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate validation (in a real app, you might want to validate the key with a test request)
    setTimeout(() => {
      localStorage.setItem('googleMapsApiKey', apiKey);
      onApiKeySet(apiKey);
      toast.success('Google Maps API key saved');
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <div className="bg-yellow-50 p-6 rounded-lg mb-6 border border-yellow-200">
      <h3 className="font-medium text-yellow-800 mb-2">Google Maps API Key Required</h3>
      <p className="text-sm text-yellow-700 mb-4">
        To view venue maps and get directions, please enter your Google Maps API key. 
        This will be stored locally on your device only.
      </p>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-2">
          <Input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Google Maps API key"
            className="flex-grow"
            disabled={isSubmitting}
          />
          <Button 
            onClick={handleSaveApiKey} 
            disabled={isSubmitting || !apiKey.trim()}
            className="whitespace-nowrap"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⚙️</span> 
                Saving...
              </>
            ) : 'Save Key'}
          </Button>
        </div>
        <div className="text-xs text-yellow-600">
          <p className="mb-1">How to get an API key:</p>
          <ol className="list-decimal ml-5 space-y-1">
            <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline flex items-center">Google Cloud Console <ExternalLink size={12} className="ml-1" /></a></li>
            <li>Create a new project (if you don't have one)</li>
            <li>Enable the Google Maps JavaScript API</li>
            <li>Create an API key from the Credentials page</li>
            <li>Set appropriate restrictions (optional but recommended)</li>
          </ol>
          <p className="mt-2">
            For detailed instructions, visit the <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank" rel="noopener noreferrer" className="underline flex items-center inline-flex">Google Maps documentation <ExternalLink size={12} className="ml-1" /></a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsApiInput;
