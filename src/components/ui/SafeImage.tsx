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
  const hasAspectRatio = !!aspectRatio;
  
  // Apply default 16/9 aspect ratio if no dimensions or aspectRatio provided
  const finalStyle = hasAspectRatio 
    ? { aspectRatio, ...style }
    : !hasDims 
      ? { aspectRatio: '16 / 9', ...style }
      : style;

  return (
    <img
      {...rest}
      loading={loading}
      decoding={decoding as any}
      {...(fetchPriority !== 'auto' && { fetchpriority: fetchPriority })}
      width={hasDims ? width : undefined}
      height={hasDims ? height : undefined}
      style={finalStyle}
    />
  );
}

export default SafeImage;