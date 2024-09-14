import { QrCode } from "lucide-react";

type BadgeProps = {
  name: string;
  role: string;
  color: "purple";
};

export const Badge = ({ name, role, color }: BadgeProps) => {
  const bgColor = {
    purple: "bg-purple-600",
  }[color];

  return (
    <div className="relative">
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-20 h-16 bg-black flex items-center justify-center">
        <div
          className="text-white text-xs font-mono rotate-180"
          style={{ writingMode: "vertical-rl" }}
        >
          RENDER CON &apos;24
        </div>
      </div>

      {/* Badge */}
      <div
        className={`w-64 h-96 ${bgColor} rounded-lg shadow-lg overflow-hidden flex flex-col text-white`}
      >
        <div className="p-4 flex-grow">
          <div className="text-sm font-mono mb-4">
            IT / TRANS
            <br />
            FORMATION
            <br />
            DAY___
          </div>
          <div className="w-6 h-6 border-2 rounded-full mb-8" />
          <div className="text-2xl font-bold mb-1">{name.toUpperCase()}</div>
          <div className="text-sm font-mono">{role.toUpperCase()}</div>
        </div>
        <div className="bg-gray-800 p-4 flex justify-between items-center">
          <QrCode className="w-12 h-12 text-white" />
          <div className="text-white text-xs font-mono">DDMMYY</div>
        </div>
      </div>

      {/* Badge Clip */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-black rounded-b-lg" />
    </div>
  );
};

export function EventBadge() {
  return (
    <div className="flex space-x-4 pt-16">
      <Badge name="Alex Krivov" role="Speaker" color="purple" />
    </div>
  );
}
