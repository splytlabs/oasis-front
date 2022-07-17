/* eslint-disable @next/next/no-img-element */
export type ImgProps = {
  className?: string;
  src: string;
  alt?: string;
};

export default function Img({ className, src, alt }: ImgProps) {
  return (
    <img
      className={className}
      src={src}
      alt={alt ?? src.substring(0, 16)}
    ></img>
  );
}
