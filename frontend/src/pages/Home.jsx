import React, { useState } from "react";

export default function Home() {
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  const createGroup = () => {
    const id = Math.random().toString(36).slice(2, 8);
    setLink(`${window.location.origin}/join?group=${id}&leader=true`);
    setCopied(false);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#0b0f1a] text-white overflow-hidden">

      {/* Network-style background */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.35)_1px,transparent_1px)] bg-[length:48px_48px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-transparent to-purple-900/40" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2 text-xl font-bold">
          <span className="text-indigo-400">⬢</span>
          LiveTracker
        </div>
        <div className="text-sm text-gray-300">
          Real-time • Secure • Private
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 mt-20">

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Visualize Your <span className="text-indigo-400">Live Network</span>
        </h1>

        <p className="mt-6 max-w-2xl text-gray-300 text-lg">
          Create a private group and track members in real time with a
          secure, interactive network-based experience.
        </p>

        {/* CTA */}
        <button
          onClick={createGroup}
          className="mt-10 px-10 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold text-lg shadow-lg hover:scale-[1.03] transition-all"
        >
          Create Tracking Group
        </button>

        {/* Generated Link */}
        {link && (
          <div className="mt-8 w-full max-w-xl bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-2">
              Share this private invite link
            </p>
            <div className="flex gap-2">
              <input
                value={link}
                readOnly
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none"
              />
              <button
                onClick={copyLink}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition text-sm"
              >
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
          </div>
        )}

        {/* Feature Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-indigo-400">Live</p>
            <p className="text-sm text-gray-400 mt-1">Real-time updates</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-400">Private</p>
            <p className="text-sm text-gray-400 mt-1">Invite-only groups</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-400">Secure</p>
            <p className="text-sm text-gray-400 mt-1">Encrypted sharing</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-24 pb-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} LiveTracker — Built for real-time safety
      </footer>
    </div>
  );
}
