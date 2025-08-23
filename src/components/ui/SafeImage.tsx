import * as React from 'react';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  width?: number;
  height?: number;
  aspectRatio?: `${number} / ${number}`; // e.g., '16 / 9'
  fetchPriority?: 'high' | 'low' | 'auto';
};

export function SafeImage({
  width,
  height,
  aspectRatio,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
  style,
  ...rest
}: Props) {
  const hasDims = !!width && !!height;
  const styleWithAR = aspectRatio ? { aspectRatio, ...style } : style;

  return (
    <img
      {...rest}
      loading={loading}
      decoding={decoding as any}
      {...(fetchPriority !== 'auto' && { fetchPriority })}
      width={hasDims ? width : undefined}
      height={hasDims ? height : undefined}
      style={styleWithAR}
    />
  );
}

export default SafeImage;