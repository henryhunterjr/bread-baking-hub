import * as React from 'react';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  width?: number;
  height?: number;
  aspectRatio?: `${number} / ${number}`;
  fetchPriority?: 'high' | 'low' | 'auto';
  fit?: 'cover' | 'contain' | 'none';
};

export default function SafeImage({
  width,
  height,
  aspectRatio,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
  fit = 'cover',
  style,
  ...rest
}: Props) {
  const styleWithAR = aspectRatio
    ? { aspectRatio, objectFit: fit, ...style }
    : { objectFit: fit, ...style };
  const useDims = !aspectRatio;
  const onlyW = useDims && width && !height;
  const onlyH = useDims && height && !width;
  const w = useDims ? width : undefined;
  const h = useDims ? height : undefined;
  
  return (
    <img
      {...rest}
      loading={loading}
      decoding={decoding as any}
      {...(fetchPriority !== 'auto' && { fetchPriority })}
      width={onlyW ? width : w}
      height={onlyH ? height : h}
      style={styleWithAR}
    />
  );
}

export { SafeImage };