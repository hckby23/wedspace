"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  placeholder = '/img/placeholder.jpg',
  blurDataURL,
  priority = false,
  quality = 75,
  sizes,
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : placeholder);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Load actual image when in view
  useEffect(() => {
    if (isInView && !isLoaded && !hasError) {
      setCurrentSrc(src);
    }
  }, [isInView, isLoaded, hasError, src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setCurrentSrc(placeholder);
    onError?.();
  };

  // Generate optimized image URL
  const getOptimizedSrc = (originalSrc: string) => {
    if (originalSrc === placeholder || originalSrc.startsWith('data:')) {
      return originalSrc;
    }

    // If using a CDN or image optimization service
    if (originalSrc.includes('cloudinary.com') || originalSrc.includes('imagekit.io')) {
      return originalSrc;
    }

    // For local images, you might want to add optimization parameters
    const url = new URL(originalSrc, window.location.origin);
    if (quality && quality < 100) {
      url.searchParams.set('q', quality.toString());
    }
    if (width) {
      url.searchParams.set('w', width.toString());
    }
    if (height) {
      url.searchParams.set('h', height.toString());
    }

    return url.toString();
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gray-100 dark:bg-gray-800',
        className
      )}
      style={{ width, height }}
    >
      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
          aria-hidden="true"
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={getOptimizedSrc(currentSrc)}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          hasError && 'opacity-50'
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />

      {/* Loading indicator */}
      {!isLoaded && !hasError && isInView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Progressive image component with multiple sizes
export function ProgressiveImage({
  src,
  alt,
  width,
  height,
  className,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false
}: LazyImageProps) {
  const [currentSrc, setCurrentSrc] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate different image sizes
  const generateSrcSet = (baseSrc: string) => {
    const sizes = [320, 640, 768, 1024, 1280, 1920];
    return sizes
      .map(size => {
        const url = new URL(baseSrc, window.location.origin);
        url.searchParams.set('w', size.toString());
        return `${url.toString()} ${size}w`;
      })
      .join(', ');
  };

  useEffect(() => {
    if (priority) {
      setCurrentSrc(src);
      return;
    }

    // Load low quality image first
    const lowQualityUrl = new URL(src, window.location.origin);
    lowQualityUrl.searchParams.set('q', '20');
    lowQualityUrl.searchParams.set('w', '50');
    
    const lowQualityImg = new Image();
    lowQualityImg.onload = () => {
      setCurrentSrc(lowQualityUrl.toString());
      
      // Then load high quality image
      const highQualityImg = new Image();
      highQualityImg.onload = () => {
        setCurrentSrc(src);
        setIsLoaded(true);
      };
      highQualityImg.src = src;
    };
    lowQualityImg.src = lowQualityUrl.toString();
  }, [src, priority]);

  return (
    <div className={cn('relative overflow-hidden', className)} style={{ width, height }}>
      {currentSrc && (
        <img
          src={currentSrc}
          srcSet={isLoaded ? generateSrcSet(src) : undefined}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            'w-full h-full object-cover transition-all duration-500',
            isLoaded ? 'filter-none' : 'filter blur-sm scale-110'
          )}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}
    </div>
  );
}

// Image gallery with lazy loading
export function ImageGallery({
  images,
  className,
  itemClassName,
  priority = false
}: {
  images: Array<{ src: string; alt: string; width?: number; height?: number }>;
  className?: string;
  itemClassName?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4', className)}>
      {images.map((image, index) => (
        <LazyImage
          key={index}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className={cn('aspect-square rounded-lg', itemClassName)}
          priority={priority && index < 4} // Prioritize first 4 images
        />
      ))}
    </div>
  );
}
