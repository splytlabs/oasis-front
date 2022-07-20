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
  return (
    <div
      className={tw`
        w-${`[${width ?? 280}px]`} h-auto border-solid
        bg-primary-50 rounded-lg
        flex flex-col pt-2 px-4
      `}
    >
      <div className={tw`py-4 font-bold text-gray-600`}>{name}</div>
      <div className={tw`w-full pt-[100%] rounded-xl bg-white`}>
        <Img className={tw`w-full -mt-[100%] rounded-xl`} src={image} />
      </div>
      <div>{children ?? <div className={tw`h-16`}></div>}</div>
    </div>
  );
}
