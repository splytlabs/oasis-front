import { tw } from 'twind';
import Img from './img';

export type NFTCardProps = {
  width?: number;
  name: string;
  image: string;
  children?: React.ReactNode;
};

export default function NFTCard({
  width,
  name,
  image,
  children,
}: NFTCardProps) {
  const s = `[${width ?? 280}px]`;

  return (
    <div
      className={tw`
        w-${s} h-auto border-solid
        bg-primary-50 rounded-lg
        flex flex-col px-4 pt-2
      `}
    >
      <div className={tw`py-4 font-bold text-gray-600`}>{name}</div>
      <Img className={tw`rounded-lg`} src={image}></Img>
      <div>{children ?? <div className={tw`h-16`}></div>}</div>
    </div>
  );
}
