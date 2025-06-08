import React, { useState } from 'react';
import Image from 'next/image';
import { Box, Skeleton, Typography } from '@mui/material';
import { BrokenImage } from '@mui/icons-material';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  style?: React.CSSProperties;
  className?: string;
  fallbackSrc?: string;
  showLoadingSkeleton?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  style,
  className,
  fallbackSrc,
  showLoadingSkeleton = true,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
    
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setError(false);
      setLoading(true);
    }
    
    onError?.();
  };

  const generateBlurDataURL = (w: number, h: number) => {
    // Create a minimal base64 encoded SVG for blur placeholder
    const svg = `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient">
            <stop offset="0%" stop-color="#f0f0f0"/>
            <stop offset="100%" stop-color="#e0e0e0"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#gradient)"/>
      </svg>
    `;
    const base64 = Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
  };

  const imageProps = {
    src: currentSrc,
    alt,
    quality,
    priority,
    sizes: sizes || fill ? '100vw' : undefined,
    placeholder: placeholder === 'blur' ? 'blur' : 'empty',
    blurDataURL: blurDataURL || (placeholder === 'blur' && width && height ? 
      generateBlurDataURL(width, height) : undefined),
    onLoad: handleLoad,
    onError: handleError,
    style: {
      objectFit: 'cover' as const,
      ...style,
    },
    className,
  };

  if (error) {
    return (
      <Box
        sx={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
          borderRadius: 1,
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <BrokenImage sx={{ fontSize: 40, color: 'grey.400' }} />
        <Typography variant="caption" color="grey.500">
          Image not available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: fill ? '100%' : width, height: fill ? '100%' : height }}>
      {loading && showLoadingSkeleton && (
        <Skeleton
          variant="rectangular"
          width={fill ? '100%' : width}
          height={fill ? '100%' : height}
          sx={{
            position: fill ? 'absolute' : 'static',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
      )}
      
      {fill ? (
        <Image
          {...imageProps}
          fill
          style={{
            ...imageProps.style,
            opacity: loading ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}
        />
      ) : (
        <Image
          {...imageProps}
          width={width}
          height={height}
          style={{
            ...imageProps.style,
            opacity: loading ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
    </Box>
  );
}

// Avatar component with optimization
interface OptimizedAvatarProps {
  src?: string;
  alt: string;
  size?: number;
  fallbackText?: string;
  priority?: boolean;
}

export function OptimizedAvatar({
  src,
  alt,
  size = 40,
  fallbackText,
  priority = false,
}: OptimizedAvatarProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.4,
          fontWeight: 'bold',
        }}
      >
        {fallbackText ? fallbackText.charAt(0).toUpperCase() : alt.charAt(0).toUpperCase()}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        width={size}
        height={size}
        priority={priority}
        quality={85}
        onError={() => setError(true)}
        showLoadingSkeleton={false}
        style={{
          borderRadius: '50%',
        }}
      />
    </Box>
  );
}

// Gallery component with lazy loading
interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  columns?: number;
  spacing?: number;
}

export function ImageGallery({ images, columns = 3, spacing = 2 }: ImageGalleryProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: spacing,
        width: '100%',
      }}
    >
      {images.map((image, index) => (
        <Box key={index} sx={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', borderRadius: 1 }}>
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            fill
            sizes={`(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw`}
            quality={60}
            placeholder="blur"
          />
          {image.caption && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                p: 1,
                fontSize: '0.875rem',
              }}
            >
              {image.caption}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}

export default OptimizedImage;