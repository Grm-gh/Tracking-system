import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Join() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [params] = useSearchParams();
  const nav = useNavigate();

  const joinGroup = () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    setError("");
    nav(
      `/map?group=${params.get("group")}&name=${encodeURIComponent(
        name
      )}&leader=${params.get("leader")}`
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 text-white">

      {/* 🗺️ MAP IMAGE BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://media.sciencephoto.com/image/e7800943/800wm/E7800943-Vatican_City,_satellite_image.jpg')",
        }}
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60" />

      {/* MOVING TRACKING POINTS */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <span
            key={i}
            className="absolute w-2 h-2 bg-emerald-400 rounded-full animate-track shadow-[0_0_18px_rgba(52,211,153,0.9)]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* CARD */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
            <span className="text-2xl">📍</span>
          </div>
        </div>

        <h2 className="text-3xl font-extrabold mb-2">
          Join Live Tracking
        </h2>

        <p className="text-gray-300 text-sm mb-8">
          You are joining a real-time location tracking system.
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {error && (
          <p className="text-sm text-red-400 mt-2 text-left">
            {error}
          </p>
        )}

        <button
          onClick={joinGroup}
          className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 font-semibold text-lg shadow-lg hover:scale-[1.03] transition-all"
        >
          Join Group
        </button>

        <div className="mt-8 flex justify-center gap-6 text-sm text-gray-300">
          <span>🟢 Live</span>
          <span>🗺️ Map</span>
          <span>📡 Tracking</span>
        </div>
      </div>

      {/* ANIMATION */}
      <style>
        {`
          @keyframes track {
            0% { transform: translate(0, 0); opacity: 0.5; }
            50% { transform: translate(60px, -40px); opacity: 1; }
            100% { transform: translate(0, 0); opacity: 0.5; }
          }
          .animate-track {
            animation: track 12s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}
