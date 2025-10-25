"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// Generate optimized image URL
function getOptimizedImageUrl(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  }
) {
  // Skip optimization for external URLs or data URLs
  if (src.startsWith('http') || src.startsWith('data:')) {
    return src;
  }

  const url = new URL(src, window.location.origin);
  
  if (options.width) url.searchParams.set('w', options.width.toString());
  if (options.height) url.searchParams.set('h', options.height.toString());
  if (options.quality) url.searchParams.set('q', options.quality.toString());
  if (options.format) url.searchParams.set('f', options.format);
  
  return url.toString();
}

// Generate srcSet for responsive images
function generateSrcSet(
  src: string,
  options: {
    quality?: number;
    format?: string;
  }
) {
  const breakpoints = [320, 640, 768, 1024, 1280, 1920];
  
  return breakpoints
    .map(width => {
      const optimizedUrl = getOptimizedImageUrl(src, {
        ...options,
        width
      });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
}

// Create low-quality placeholder
function createBlurPlaceholder(src: string): string {
  return getOptimizedImageUrl(src, {
    width: 10,
    quality: 10,
    format: 'jpg'
  });
}

export function ImageOptimizer({
  src,
  alt,
  width,
  height,
  className,
  quality = 75,
  format = 'webp',
  sizes = '100vw',
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError
}: ImageOptimizerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate optimized URLs
  const optimizedSrc = getOptimizedImageUrl(src, { width, height, quality, format });
  const srcSet = generateSrcSet(src, { quality, format });
  const placeholderSrc = blurDataURL || (placeholder === 'blur' ? createBlurPlaceholder(src) : '');

  // Intersection Observer for lazy loading
  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      }
    });
  }, []);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    observerRef.current = new IntersectionObserver(observerCallback, {
      rootMargin: '50px',
      threshold: 0.1
    });

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority, observerCallback]);

  // Load image when in view
  useEffect(() => {
    if (!isInView || isLoaded || hasError) return;

    // Load placeholder first if available
    if (placeholderSrc && !currentSrc) {
      setCurrentSrc(placeholderSrc);
    }

    // Preload the actual image
    const img = new Image();
    img.onload = () => {
      setCurrentSrc(optimizedSrc);
      setIsLoaded(true);
      onLoad?.();
    };
    img.onerror = () => {
      setHasError(true);
      onError?.();
    };
    img.src = optimizedSrc;
  }, [isInView, isLoaded, hasError, optimizedSrc, placeholderSrc, currentSrc, onLoad, onError]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gray-100 dark:bg-gray-800',
        className
      )}
      style={{ width, height }}
    >
      {/* Placeholder/blur image */}
      {placeholder === 'blur' && placeholderSrc && !isLoaded && (
        <img
          src={placeholderSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110 opacity-60"
          aria-hidden="true"
        />
      )}

      {/* Main optimized image */}
      {currentSrc && (
        <img
          ref={imgRef}
          src={currentSrc}
          srcSet={isLoaded ? srcSet : undefined}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}

      {/* Loading indicator */}
      {isInView && !isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
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

// Optimized image gallery component
export function OptimizedImageGallery({
  images,
  className,
  itemClassName,
  columns = 3,
  quality = 75,
  format = 'webp'
}: {
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  className?: string;
  itemClassName?: string;
  columns?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
}) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns as keyof typeof gridCols], className)}>
      {images.map((image, index) => (
        <ImageOptimizer
          key={index}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className={cn('aspect-square rounded-lg', itemClassName)}
          quality={quality}
          format={format}
          priority={index < 6} // Prioritize first 6 images
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      ))}
    </div>
  );
}

// Progressive image component with multiple quality levels
export function ProgressiveImage({
  src,
  alt,
  width,
  height,
  className,
  quality = [20, 50, 75],
  format = 'webp'
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  quality?: number[];
  format?: 'webp' | 'avif' | 'jpg' | 'png';
}) {
  const [currentQuality, setCurrentQuality] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (currentQuality >= quality.length - 1) return;

    const timer = setTimeout(() => {
      setCurrentQuality(prev => Math.min(prev + 1, quality.length - 1));
    }, 500);

    return () => clearTimeout(timer);
  }, [currentQuality, quality.length]);

  const currentSrc = getOptimizedImageUrl(src, {
    width,
    height,
    quality: quality[currentQuality],
    format
  });

  return (
    <div className={cn('relative overflow-hidden', className)} style={{ width, height }}>
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'w-full h-full object-cover transition-all duration-500',
          currentQuality < quality.length - 1 ? 'filter blur-sm' : 'filter-none',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
        decoding="async"
      />
      
      {/* Quality indicator */}
      {currentQuality < quality.length - 1 && (
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Loading... {Math.round((currentQuality + 1) / quality.length * 100)}%
        </div>
      )}
    </div>
  );
}

// Image with format detection and fallback
export function AdaptiveImage({
  src,
  alt,
  width,
  height,
  className,
  quality = 75
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  quality?: number;
}) {
  const [supportedFormat, setSupportedFormat] = useState<string>('jpg');

  useEffect(() => {
    // Check WebP support
    const webp = new Image();
    webp.onload = webp.onerror = () => {
      setSupportedFormat(webp.height === 2 ? 'webp' : 'jpg');
    };
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';

    // Check AVIF support
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      if (avif.height === 2) {
        setSupportedFormat('avif');
      }
    };
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  }, []);

  return (
    <ImageOptimizer
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      quality={quality}
      format={supportedFormat as any}
    />
  );
}
