import * as React from 'react';

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'fetchpriority'> & {
  aspectRatio?: `${number} / ${number}`;
  fit?: 'cover' | 'contain' | 'none';
  fetchpriority?: 'high' | 'low' | 'auto';
};

export default function SafeImage({
  aspectRatio,
  fit = 'cover',
  fetchpriority,
  style,
  ...rest
}: Props) {
  const styleWithAR = aspectRatio
    ? { aspectRatio, objectFit: fit, ...style }
    : { objectFit: fit, ...style };

  // Don't pass unknown camelCase props; attach lowercase attribute explicitly
  const lower = fetchpriority ? ({ fetchpriority } as any) : {};

  return <img {...rest} {...lower} style={styleWithAR} />;
}

export { SafeImage };