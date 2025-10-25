"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { AIService } from '@/services/AIService';

interface ImageSearchUploadProps {
  onResults?: (results: any[]) => void;
  onError?: (error: string) => void;
  className?: string;
}

export default function ImageSearchUpload({ 
  onResults, 
  onError,
  className = '' 
}: ImageSearchUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError?.('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onError?.('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSearch = async () => {
    if (!selectedImage) return;

    setIsSearching(true);
    try {
      const response = await AIService.findSimilarVenues(selectedImage);
      
      if (response.success && response.data) {
        onResults?.(response.data);
      } else {
        onError?.(response.error || 'Search failed');
      }
    } catch (error) {
      onError?.('Failed to search by image');
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
          <ImageIcon className="w-4 h-4" />
          <span>Search by Image</span>
        </div>

        {!selectedImage ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-red-600 dark:hover:border-red-500 transition-colors"
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              PNG, JPG up to 5MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={selectedImage}
                alt="Search image"
                className="w-full h-48 object-cover"
              />
              <button
                onClick={handleReset}
                className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Find Similar Venues
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
