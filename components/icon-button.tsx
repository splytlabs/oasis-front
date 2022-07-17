import { tw } from 'twind';

export type IconButtonProps = {
  className?: string;
  icon: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function IconButton({
  className,
  icon,
  onClick,
}: IconButtonProps) {
  return (
    <button
      className={tw`
        ${className} flex justify-center items-center focus:outline-none
        w-12 h-12 rounded-full bg-primary-50 text-2xl text-primary-700
      `}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
