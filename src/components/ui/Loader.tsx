import loaderImg from '@/assets/loader.png';

export const Loader = ({ className }: { className?: string }) => {
  return (
    <div className={`flex bg-[#103A3A] h-[52px] w-[52px] rounded-full items-center justify-center ${className}`}>
      <img
        src={loaderImg}
        alt="loader"
        className="animate-spin h-[70%] w-[70%]"
      />
    </div>
  );
};
