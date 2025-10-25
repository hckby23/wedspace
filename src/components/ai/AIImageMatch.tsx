"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Sparkles, 
  Search, 
  X,
  Eye,
  Zap,
  Target,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIImageMatchProps {
  onVenuesFound?: (venues: any[], matchType: string) => void;
  className?: string;
}

interface MatchResult {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
  matchScore: number;
  matchReasons: string[];
  similarFeatures: string[];
}

const AIImageMatch: React.FC<AIImageMatchProps> = ({
  onVenuesFound,
  className
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [analysisType, setAnalysisType] = useState<'style' | 'color' | 'layout' | 'overall'>('overall');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (type: typeof analysisType) => {
    if (!uploadedImage) return;

    setIsAnalyzing(true);
    setAnalysisType(type);

    // Simulate AI image analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock results based on analysis type
    const mockResults: MatchResult[] = [
      {
        id: '1',
        name: 'Royal Gardens Banquet',
        location: 'Andheri, Mumbai',
        price: 150000,
        image: '/api/placeholder/300/200',
        matchScore: 0.92,
        matchReasons: getMatchReasons(type),
        similarFeatures: getSimilarFeatures(type)
      },
      {
        id: '2',
        name: 'Sunset Lawn',
        location: 'Juhu, Mumbai',
        price: 200000,
        image: '/api/placeholder/300/200',
        matchScore: 0.87,
        matchReasons: getMatchReasons(type),
        similarFeatures: getSimilarFeatures(type)
      },
      {
        id: '3',
        name: 'Grand Palace Hotel',
        location: 'Bandra, Mumbai',
        price: 300000,
        image: '/api/placeholder/300/200',
        matchScore: 0.81,
        matchReasons: getMatchReasons(type),
        similarFeatures: getSimilarFeatures(type)
      }
    ];

    setMatchResults(mockResults);
    setIsAnalyzing(false);
    onVenuesFound?.(mockResults, type);
  };

  const getMatchReasons = (type: typeof analysisType): string[] => {
    switch (type) {
      case 'style':
        return ['Similar architectural style', 'Matching decorative elements', 'Comparable elegance level'];
      case 'color':
        return ['Matching color palette', 'Similar lighting ambiance', 'Complementary color scheme'];
      case 'layout':
        return ['Similar space configuration', 'Matching seating arrangement', 'Comparable venue size'];
      case 'overall':
        return ['Overall aesthetic match', 'Similar venue atmosphere', 'Matching style and ambiance'];
      default:
        return ['AI-detected similarities'];
    }
  };

  const getSimilarFeatures = (type: typeof analysisType): string[] => {
    switch (type) {
      case 'style':
        return ['Traditional architecture', 'Ornate decorations', 'Classic design'];
      case 'color':
        return ['Warm lighting', 'Gold accents', 'Rich color tones'];
      case 'layout':
        return ['Open floor plan', 'Central stage area', 'Multiple seating zones'];
      case 'overall':
        return ['Elegant ambiance', 'Spacious layout', 'Premium finishes'];
      default:
        return ['Various matching features'];
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
    setMatchResults([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.8) return 'text-blue-600';
    if (score >= 0.7) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.9) return 'Excellent Match';
    if (score >= 0.8) return 'Good Match';
    if (score >= 0.7) return 'Fair Match';
    return 'Partial Match';
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-purple-600" />
          AI Visual Venue Matching
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="w-3 h-3 mr-1" />
            Beta
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload an inspiration image to find venues with similar style, colors, or layout
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div className="space-y-4">
          {!uploadedImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 transition-colors"
            >
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Upload inspiration image</p>
                  <p className="text-sm text-muted-foreground">
                    Drop an image here or click to browse
                  </p>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    JPG, PNG
                  </span>
                  <span className="flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    Max 10MB
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img
                src={uploadedImage}
                alt="Uploaded inspiration"
                className="w-full h-64 object-cover rounded-lg"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={clearImage}
                className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/90 dark:bg-gray-900/90"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Analysis Options */}
        {uploadedImage && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Choose analysis type:</h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {[
                  { id: 'overall', label: 'Overall Match', icon: Target, desc: 'Complete aesthetic' },
                  { id: 'style', label: 'Style Match', icon: Sparkles, desc: 'Architecture & design' },
                  { id: 'color', label: 'Color Match', icon: Palette, desc: 'Color palette & lighting' },
                  { id: 'layout', label: 'Layout Match', icon: Search, desc: 'Space configuration' }
                ].map(({ id, label, icon: Icon, desc }) => (
                  <Button
                    key={id}
                    variant="outline"
                    onClick={() => analyzeImage(id as typeof analysisType)}
                    disabled={isAnalyzing}
                    className="h-auto p-3 flex flex-col items-center gap-2"
                  >
                    <Icon className="w-5 h-5" />
                    <div className="text-center">
                      <div className="font-medium text-sm">{label}</div>
                      <div className="text-xs text-muted-foreground">{desc}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analysis Status */}
        {isAnalyzing && (
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Eye className="w-5 h-5 text-purple-600 animate-pulse" />
                  <div className="absolute inset-0 w-5 h-5 border-2 border-purple-600 rounded-full animate-spin border-t-transparent" />
                </div>
                <div>
                  <p className="font-medium text-purple-800 dark:text-purple-300">
                    AI is analyzing your image...
                  </p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    Detecting {analysisType} patterns and finding matching venues
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Match Results */}
        {matchResults.length > 0 && !isAnalyzing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                Found {matchResults.length} matching venues
              </h4>
              <Badge variant="outline" className="capitalize">
                {analysisType} analysis
              </Badge>
            </div>

            <div className="space-y-3">
              {matchResults.map((result) => (
                <Card key={result.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={result.image}
                        alt={result.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h5 className="font-medium truncate">{result.name}</h5>
                            <p className="text-sm text-muted-foreground">{result.location}</p>
                          </div>
                          <div className="text-right">
                            <div className={cn("font-semibold", getScoreColor(result.matchScore))}>
                              {Math.round(result.matchScore * 100)}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {getScoreLabel(result.matchScore)}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {result.similarFeatures.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>

                          <div className="text-sm text-muted-foreground">
                            <strong>Why it matches:</strong> {result.matchReasons[0]}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-green-600">
                              ₹{result.price.toLocaleString('en-IN')}
                            </span>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                  Pro Tips for Better Matches
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• Use high-quality, well-lit images for best results</li>
                  <li>• Include multiple angles or elements you want to match</li>
                  <li>• Try different analysis types to explore various matching criteria</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default AIImageMatch;
