"use client";

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EnhancedPageHero from '@/components/layout/EnhancedPageHero';
import PageContainer from '@/components/layout/PageContainer';
import { 
  Image as ImageIcon, 
  Upload, 
  Camera, 
  Palette, 
  Sparkles, 
  Search,
  X,
  Eye,
  Download,
  Heart
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface AnalysisResult {
  colors: string[];
  style: string;
  mood: string;
  elements: string[];
  confidence: number;
}

interface MatchedVenue {
  id: string;
  name: string;
  image: string;
  similarity: number;
  matchingElements: string[];
}

export default function VisualSearchPage() {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [matchedVenues, setMatchedVenues] = useState<MatchedVenue[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'results'>('upload');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedImages(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 5
  });

  const analyzeImages = async () => {
    if (uploadedImages.length === 0) return;
    setIsAnalyzing(true);
    setActiveTab('results');
    try {
      const form = new FormData();
      uploadedImages.forEach((f, i) => form.append('images', f));
      const res = await fetch('/api/ai/visual-search', { method: 'POST', body: form });
      if (res.ok) {
        const data = await res.json();
        setAnalysisResults((data?.analysis as AnalysisResult[]) || []);
        setMatchedVenues((data?.matches as MatchedVenue[]) || []);
      } else {
        setAnalysisResults([]);
        setMatchedVenues([]);
      }
    } catch {
      setAnalysisResults([]);
      setMatchedVenues([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: ImageIcon, text: 'AI' }}
        title="Visual"
        titleGradient="Style Matching"
        description="Upload inspiration photos to find venues that match your aesthetic vision."
      />

      <PageContainer className="py-12">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6 max-w-md">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Upload Images
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'results'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-300'
            }`}
            disabled={uploadedImages.length === 0}
          >
            Results
          </button>
        </div>

        {activeTab === 'upload' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Area */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Inspiration Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? 'border-red-500 bg-red-50 dark:bg-red-950'
                        : 'border-gray-300 dark:border-gray-600 hover:border-red-400'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center space-y-4">
                      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                        <ImageIcon className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                          {isDragActive ? 'Drop images here' : 'Upload inspiration photos'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          Drag & drop or click to select (max 5 images)
                        </p>
                      </div>
                      <Button variant="outline">
                        <Camera className="h-4 w-4 mr-2" />
                        Choose Files
                      </Button>
                    </div>
                  </div>

                  {/* Uploaded Images Preview */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Uploaded Images ({uploadedImages.length})
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {uploadedImages.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Instructions */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                      <Upload className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Upload Photos</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Add images that represent your dream wedding style
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                      <Sparkles className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">AI Analysis</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Our AI extracts colors, style, and design elements
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                      <Search className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Find Matches</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Get venues that match your visual preferences
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Best Results With:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• High-quality, well-lit photos</li>
                      <li>• Clear architectural details</li>
                      <li>• Multiple angles/perspectives</li>
                      <li>• Consistent style elements</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {uploadedImages.length > 0 && (
                <Button 
                  onClick={analyzeImages}
                  className="w-full mt-4 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white"
                  size="lg"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Analyze Images & Find Matches
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Results Tab */
          <div className="space-y-6">
            {isAnalyzing ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  <span className="text-lg text-gray-600 dark:text-gray-300">
                    Analyzing your images with AI...
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  This may take a few moments
                </p>
              </div>
            ) : analysisResults.length > 0 ? (
              <>
                {/* Analysis Results */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Palette className="h-5 w-5 mr-2" />
                      Style Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Color Palette */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Color Palette</h4>
                        <div className="flex space-x-2">
                          {analysisResults[0]?.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Style */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Style</h4>
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                          {analysisResults[0]?.style}
                        </Badge>
                      </div>

                      {/* Mood */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Mood</h4>
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                          {analysisResults[0]?.mood}
                        </Badge>
                      </div>

                      {/* Confidence */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Confidence</h4>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {analysisResults[0]?.confidence.toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    {/* Key Elements */}
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Key Elements Detected</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResults[0]?.elements.map((element, index) => (
                          <Badge key={index} variant="outline">
                            {element}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Matched Venues */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Search className="h-5 w-5 mr-2" />
                      Matching Venues ({matchedVenues.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {matchedVenues.map((venue) => (
                        <div key={venue.id} className="group cursor-pointer">
                          <div className="relative overflow-hidden rounded-lg">
                            <img
                              src={venue.image}
                              alt={venue.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                {venue.similarity}% Match
                              </Badge>
                            </div>
                            <div className="absolute top-3 left-3">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <h3 className="font-medium text-gray-900 dark:text-white">{venue.name}</h3>
                            <div className="mt-2">
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Matching Elements:</p>
                              <div className="flex flex-wrap gap-1">
                                {venue.matchingElements.map((element, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {element}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Upload images to see analysis results
                </p>
              </div>
            )}
          </div>
        )}
      </PageContainer>
    </main>
  );
}
