type AdSlotProps = {
  className?: string;
};

export default function AdSlot({ className = "" }: AdSlotProps) {
  return (
    <div className={`w-full overflow-hidden my-8 ${className}`}>
      {/* Paste Google Adsense ad code here */}
      {/* <ins className="adsbygoogle" ... ></ins> */}
    </div>
  );
}