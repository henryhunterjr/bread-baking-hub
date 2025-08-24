import * as React from 'react';

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'fetchpriority'> & {
  aspectRatio?: `${number} / ${number}`;
  fit?: 'cover' | 'contain' | 'none';
  fetchpriority?: 'high' | 'low' | 'auto';
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
};

export default function SafeImage({
  aspectRatio,
  fit = 'cover',
  fetchpriority,
  crossOrigin,
  style,
  ...rest
}: Props) {
  const styleWithAR = aspectRatio
    ? { aspectRatio, objectFit: fit, ...style }
    : { objectFit: fit, ...style };

  // Don't pass unknown camelCase props; attach lowercase attribute explicitly
  const imgRef = React.useRef<HTMLImageElement>(null);
  
  React.useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    
    if (fetchpriority) {
      img.setAttribute('fetchpriority', fetchpriority);
    }
  }, [fetchpriority]);

  const additionalProps: any = {};
  if (crossOrigin) additionalProps.crossOrigin = crossOrigin;

  return <img ref={imgRef} {...rest} {...additionalProps} style={styleWithAR} />;
}

export { SafeImage };