
import React from 'react';
import RetroGrid from './components/magicui/retro-grid';
import ShimmerButton from './components/magicui/shimmer-button';
import FeatureCard from './components/FeatureCard';
import { Shield, Lock, Zap, EyeOff, UserX, Trash2 } from 'lucide-react';

const LandingPage = ({ onStart }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-black text-white">

      {/* Hero Section */}
      <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        <div className="z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
          <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Secure & Anonymous Messaging
          </div>
          <h1 className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-6xl font-bold leading-none tracking-tighter text-transparent drop-shadow-2xl md:text-8xl lg:text-9xl">
            Chat Spy
          </h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl text-gray-300 leading-relaxed">
            The ultimate tool for ephemeral communication. <br className="hidden md:block" />
            Your messages self-destruct. No logs. No traces. Just pure privacy.
          </p>

          <div className="mt-10">
            <ShimmerButton className="shadow-2xl scale-110" onClick={onStart}>
              <span className="whitespace-pre-wrap text-center text-base font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                Start Secret Chat
              </span>
            </ShimmerButton>
          </div>
        </div>
        <RetroGrid />
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 relative z-10 bg-black/50 backdrop-blur-3xl">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Why Use Chat Spy?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Trash2 className="w-12 h-12 text-red-500" />}
              title="Self-Destructing"
              description="Every message vanishes automatically after 1 minute. Nothing is saved on our servers or your device."
            />
            <FeatureCard
              icon={<Lock className="w-12 h-12 text-green-500" />}
              title="End-to-End Encrypted"
              description="Military-grade encryption ensures that only you and your recipient can read the messages."
            />
            <FeatureCard
              icon={<UserX className="w-12 h-12 text-purple-500" />}
              title="Total Anonymity"
              description="No phone numbers. No emails. Just a temporary PIN to connect and chat."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-4 relative z-10 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-16">How It Works</h2>
          <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent -z-10"></div>

            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-[#1a1a1a] rounded-full flex items-center justify-center border border-white/10 mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <span className="text-4xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Create Room</h3>
              <p className="text-gray-400">Generate a secure, temporary chat room with one click.</p>
            </div>
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-[#1a1a1a] rounded-full flex items-center justify-center border border-white/10 mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <span className="text-4xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Share PIN</h3>
              <p className="text-gray-400">Send the unique 6-digit PIN to your contact securely.</p>
            </div>
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-[#1a1a1a] rounded-full flex items-center justify-center border border-white/10 mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <span className="text-4xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Chat & Vanish</h3>
              <p className="text-gray-400">Start chatting. Watch your messages disappear forever.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & CTA */}
      <section className="py-24 px-4 text-center relative z-10">
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-md">
          <h2 className="text-3xl font-bold mb-6">Ready to go off the record?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join thousands of users who value their privacy. No sign-up required.
          </p>
          <ShimmerButton className="shadow-2xl mx-auto" onClick={onStart}>
            <span className="whitespace-pre-wrap text-center text-base font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              Launch Chat Spy
            </span>
          </ShimmerButton>

          <div className="mt-12 flex justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-semibold">Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-semibold">Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <EyeOff className="w-5 h-5" />
              <span className="text-sm font-semibold">Private</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 text-sm border-t border-white/5 relative z-10 bg-black">
        <p>&copy; {new Date().getFullYear()} Chat Spy. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

