import { tw } from 'twind';

// 슬라이더는 그냥 만드는게 나을 듯
//https://www.w3.org/WAI/ARIA/apg/example-index/slider/slider-multithumb

export type NFTSearchPanelProps = {
  onApply?: (query: string) => void;
  onReset?: () => void;
  onClose?: () => void;
};

export default function NFTSearchPanel(_props: NFTSearchPanelProps) {
  return (
    <div
      className={tw`
        w-[1024px] h-[720px] bg-red-300 rounded-xl
      `}
      onClick={(event) => event.stopPropagation()}
    >
      안녕하세요~
    </div>
  );
}
