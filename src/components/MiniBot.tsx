import Image from "next/image";

export default function MiniBot() {
  return (
    <div className="flex items-center gap-2 p-2 border rounded-full shadow-md bg-white w-max">
      <Image src="/cute-robot.png" width={40} height={40} alt="Mini Bot" />
      <span className="text-sm font-medium">SafeTrip Bot</span>
    </div>
  );
}
