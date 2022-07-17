import { tw } from 'twind';

export type MetricsBarEntry = {
  label: string;
  value: string;
};

export type MetricsBarProps = {
  className?: string;
  entries: MetricsBarEntry[];
};

export function MetricsBar({ className, entries }: MetricsBarProps) {
  return (
    <div
      className={tw`
        ${className} flex flex-row justify-center items-center
      `}
    >
      {entries.flatMap((item: MetricsBarEntry, index) => {
        return [
          <div
            key={index}
            className={tw`
              flex flex-col justify-center items-center gap-1 px-8
            `}
          >
            <div
              className={tw`
                whitespace-nowrap
                font-bold text-xl text-primary-700
              `}
            >
              {item.value}
            </div>
            <div
              className={tw`
                whitespace-nowrap
                font-bold text-xs text-primary-300 mb-2
              `}
            >
              {item.label}
            </div>
          </div>,
          <div key={`D-${index}`}>
            {index !== entries.length - 1 && (
              <div
                className={tw`border-solid border-l-1 border-primary-300 h-8`}
              />
            )}
          </div>,
        ];
      })}
    </div>
  );
}
