"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Tilt from 'react-parallax-tilt';
import AuthModal from '@/components/AuthModel';
import { Toaster } from 'react-hot-toast';

export default function LandingPage() {
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
 
  const features = [
    {
      title: "Clause Detection",
      icon: '🔍',
      points: [
        "Flags auto-renewals",
        "Identifies indemnity clauses",
        "Detects missing terms"
      ]
    },
    {
    title: 'AI-Powered Suggestions',
    icon: '🤖',
    points: [
      'Suggests risk-free rewordings',
      'Highlights critical liabilities',
      'Recommends safer clauses'
    ],
  },
  {
    title: 'Smart Summaries',
    icon: '📄',
    points: [
      'Summarizes lengthy legal terms',
      'Breaks down obligations',
      'Extracts key contract highlights'
    ],
  },
  ];

 
  return (
    <div className="relative min-h-screen bg-[#0f0f0f] text-white overflow-hidden">
     <div className="absolute inset-0 z-0">
    <div className="w-full h-full bg-[url('/hero-image.avif')] bg-cover bg-center opacity-30" />
  </div>

  <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-tr from-[#291528] via-[#130c24] to-[#1a0e2f] opacity-40" />
      {/* Top Nav */}
      <div className="absolute top-4 right-6 space-x-4 z-50">
        <Button
          onClick={() => setAuthModal('login')}
          className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-4 py-2 rounded-md shadow-md transition duration-300 hover:shadow-[0_0_12px_#a855f7]"
        >
          Login
        </Button>
        <Button
          onClick={() => setAuthModal('signup')}
          className="bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white px-4 py-2 rounded-md shadow-md transition duration-300 hover:shadow-[0_0_12px_#ec4899]"
        >
          Sign Up
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 lg:px-20 py-32 gap-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent leading-[1.4]"
        >
          LegalLens AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl text-gray-300 max-w-2xl font-semibold"
        >
         Catch risky clauses before they cost you — with AI-powered contract analysis.
        </motion.p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-20 pb-24 z-10 relative">
        {features.map((feat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <Tilt glareEnable={true} glareColor="#ffffff" glareMaxOpacity={0.15} scale={1.05} transitionSpeed={1500}>
              <Card className="bg-[#1a1a1a] border border-purple-500 p-6 rounded-2xl relative group transition-all duration-300">
                <div className="absolute inset-0 rounded-2xl border-2 border-purple-500 group-hover:border-pink-500 before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-purple-500 before:to-pink-500 before:opacity-60 group-hover:before:blur-lg before:transition-all before:duration-500 z-[-1]" />
                <div className="flex space-x-4 items-center mb-2">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-pink-200/40 border border-pink-400 z-0" />
                    <div className="text-3xl z-10">{feat.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feat.title}</h3>
                </div>
                <ul className="ml-[1rem] space-y-4">
                  {feat.points?.map((point, idx) => (
                    <li key={idx} className="flex items-start space-x-6 text-md text-gray-300">
                      <img src="/rounded-tick.png" alt="tick" className="w-4 h-4 mt-[2px]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>

            </Tilt>
          </motion.div>
        ))}
      </div>
       <Toaster position="top-center" />
      <button onClick={() => setAuthModal("login")}>Login</button>
      <button onClick={() => setAuthModal("signup")}>Sign Up</button>

      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSuccess={() => console.log("Auth success")}
        />
      )}
    </div>
  );
};
