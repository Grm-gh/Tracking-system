import React from "react";

export default function TrackingBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">

      {/* MAP IMAGE */}
      <img
        src="/map-usa-dark.png"
        alt="map"
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60" />

      {/* SVG NETWORK */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* CENTRAL HUB */}
        <circle
          cx="480"
          cy="320"
          r="10"
          fill="#facc15"
          filter="url(#glow)"
        >
          <animate
            attributeName="r"
            values="10;18;10"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </circle>

        {/* CONNECTIONS */}
        {connections.map((c, i) => (
          <g key={i}>
            <path
              d={c.path}
              fill="none"
              stroke={c.color}
              strokeWidth="2"
              strokeDasharray="6 6"
              filter="url(#glow)"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="100"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>

            <circle
              cx={c.to.x}
              cy={c.to.y}
              r="5"
              fill={c.color}
              filter="url(#glow)"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

const connections = [
  {
    color: "#ec4899",
    to: { x: 200, y: 180 },
    path: "M480 320 Q350 200 200 180",
  },
  {
    color: "#22d3ee",
    to: { x: 760, y: 210 },
    path: "M480 320 Q620 180 760 210",
  },
  {
    color: "#a855f7",
    to: { x: 650, y: 420 },
    path: "M480 320 Q580 420 650 420",
  },
  {
    color: "#f97316",
    to: { x: 300, y: 430 },
    path: "M480 320 Q350 450 300 430",
  },
];
