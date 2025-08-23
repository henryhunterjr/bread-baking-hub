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
  const additionalProps: any = {};
  if (fetchpriority) additionalProps.fetchpriority = fetchpriority;
  if (crossOrigin) additionalProps.crossOrigin = crossOrigin;

  return <img {...rest} {...additionalProps} style={styleWithAR} />;
}

export { SafeImage };