import { tw } from 'twind';
import Img from './img';

export type NFTCardProps = {
  name: string;
  image: string;
  children?: React.ReactNode;
  isRented?: boolean;
};

export default function NFTCard({
  name,
  image,
  children,
  isRented = false,
}: NFTCardProps) {
  return (
    <div
      className={tw`
        h-auto border-solid
        bg-primary-50 rounded-lg
        flex flex-col pt-2 px-4 ${isRented ? 'opacity-60' : ''}
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
