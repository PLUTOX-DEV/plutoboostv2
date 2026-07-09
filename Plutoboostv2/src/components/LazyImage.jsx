import React, { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholderClassName = 'bg-gray-700/30',
  width,
  height,
}) => {
  const [ref, isVisible] = useIntersectionObserver();
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {!loaded && (
        <div className={`absolute inset-0 ${placeholderClassName} animate-pulse`} />
      )}
      {isVisible && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
};

export const ResponsiveImage = ({
  src,
  alt,
  className = '',
  webpSrc,
  jpgSrc,
  loading = 'lazy',
}) => {
  const [ref, isVisible] = useIntersectionObserver();
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
    >
      {!loaded && (
        <div className="absolute inset-0 bg-gray-700/30 animate-pulse" />
      )}
      {isVisible && (
        <picture>
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
          {jpgSrc && <source srcSet={jpgSrc} type="image/jpeg" />}
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading={loading}
            decoding="async"
            onLoad={() => setLoaded(true)}
          />
        </picture>
      )}
    </div>
  );
};
