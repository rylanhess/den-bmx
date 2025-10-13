'use client';

import { useState } from 'react';
import Link from 'next/link';
import QRCode from 'react-qr-code';

const BITCOIN_ADDRESS = 'bc1qfqet3x22wgufxcdn8xusqktvgpyfk508wjdven';
const LIGHTNING_ADDRESS = 'ryguy022@strike.me';
const CASHAPP_TAG = '$rylanhesscash';
const VENMO_HANDLE = '@Rylan-Hess';
const SUGGESTED_AMOUNT = 15;

export default function DonatePage() {
  const [copiedBitcoin, setCopiedBitcoin] = useState(false);
  const [copiedLightning, setCopiedLightning] = useState(false);
  const [copiedCashApp, setCopiedCashApp] = useState(false);
  const [copiedVenmo, setCopiedVenmo] = useState(false);

  const handleCopyBitcoin = () => {
    navigator.clipboard.writeText(BITCOIN_ADDRESS);
    setCopiedBitcoin(true);
    setTimeout(() => setCopiedBitcoin(false), 3000);
  };

  const handleCopyLightning = () => {
    navigator.clipboard.writeText(LIGHTNING_ADDRESS);
    setCopiedLightning(true);
    setTimeout(() => setCopiedLightning(false), 3000);
  };

  const handleCopyCashApp = () => {
    navigator.clipboard.writeText(CASHAPP_TAG);
    setCopiedCashApp(true);
    setTimeout(() => setCopiedCashApp(false), 3000);
  };

  const handleCopyVenmo = () => {
    navigator.clipboard.writeText(VENMO_HANDLE);
    setCopiedVenmo(true);
    setTimeout(() => setCopiedVenmo(false), 3000);
  };

  return (
    <main className="min-h-screen bg-pink-500 relative overflow-hidden">
      {/* Geometric Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400 opacity-70" style={{clipPath: 'polygon(100% 0, 0 0, 100% 100%)'}}></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-400 opacity-60" style={{clipPath: 'polygon(0 100%, 100% 100%, 0 0)'}}></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-lime-400 animate-rotate-wild"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center bg-black text-yellow-400 hover:text-pink-500 px-6 py-3 border-4 border-black font-black text-lg mb-6 transition-colors animate-pulse-crazy"
        >
          ← BACK TO HOME
        </Link>

        {/* Header - WILD */}
        <div className="text-center mb-8">
          <div className="inline-block bg-black border-8 border-yellow-400 p-6 mb-6 animate-border-spin">
            <div className="text-7xl mb-4 animate-float">💛 ₿ $</div>
            <h1 className="text-5xl md:text-6xl font-black text-yellow-400 mb-2" style={{textShadow: '3px 3px 0px #ff00ff'}}>
              DONATE NOW!
            </h1>
            <div className="h-2 bg-gradient-to-r from-pink-500 via-cyan-400 to-lime-400 animate-color-shift"></div>
          </div>
          <p className="text-3xl text-white font-black bg-black px-6 py-3 inline-block border-4 border-cyan-400 animate-shake">
            BUY MY SON A BIKE TUBE!
          </p>
        </div>

        {/* Story Card */}
        <div className="bg-black border-8 border-yellow-400 p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-3xl font-black text-yellow-400 mb-4 animate-blink">
              WHY DONATE?
            </h2>
            <p className="text-cyan-400 leading-relaxed mb-4 font-bold text-lg">
              DEN BMX helps BMX families in Denver stay connected with race schedules across Mile High, Dacono, and County Line tracks.
            </p>
            <p className="text-pink-400 leading-relaxed font-bold text-lg">
              Support keeps young riders rolling! 🚴
            </p>
          </div>

          {/* Suggested Amount */}
          <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 border-4 border-black p-6 animate-pulse-crazy">
            <div className="flex items-center justify-between bg-black p-4 border-4 border-white">
              <div>
                <h3 className="text-xl font-black text-yellow-400">
                  SUGGESTED AMOUNT
                </h3>
                <p className="text-6xl font-black text-pink-500">
                  ${SUGGESTED_AMOUNT}
                </p>
              </div>
              <div className="text-7xl animate-shake">🚴</div>
            </div>
          </div>
        </div>

        {/* Bitcoin Preferred Badge */}
        <div className="bg-black border-8 border-orange-500 text-center py-4 px-6 mb-6 font-black text-2xl animate-blink">
          <span className="text-orange-500">₿ BITCOIN PREFERRED ₿</span>
        </div>

        {/* Payment Options Grid - WILD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Bitcoin On-Chain */}
          <div className="bg-black border-8 border-orange-500 p-4 animate-pulse-crazy">
            <div className="text-center mb-3">
              <h2 className="text-2xl font-black text-orange-500 mb-1">
                ₿ BITCOIN
              </h2>
              <p className="text-sm text-yellow-400 font-black bg-black px-2 py-1 border-2 border-yellow-400 inline-block animate-blink">RECOMMENDED!</p>
            </div>

            <div className="mb-3 flex justify-center">
              <div className="bg-white p-3 border-4 border-orange-500 animate-float">
                <QRCode
                  value={`bitcoin:${BITCOIN_ADDRESS}`}
                  size={140}
                  level="M"
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="bg-yellow-400 border-4 border-black p-2">
                <code className="text-xs text-black break-all font-mono font-bold">
                  {BITCOIN_ADDRESS}
                </code>
              </div>
            </div>

            <button
              onClick={handleCopyBitcoin}
              className="w-full bg-orange-500 hover:bg-yellow-400 text-black font-black py-3 px-3 border-4 border-black transition-colors text-lg transform hover:scale-105"
            >
              {copiedBitcoin ? '✓ COPIED!' : '📋 COPY NOW'}
            </button>
          </div>

          {/* Lightning Network */}
          <div className="bg-black border-8 border-purple-500 p-4">
            <div className="text-center mb-3">
              <h2 className="text-2xl font-black text-purple-500 mb-1">
                ⚡ LIGHTNING
              </h2>
              <p className="text-sm text-cyan-400 font-black bg-black px-2 py-1 border-2 border-cyan-400 inline-block">INSTANT!</p>
            </div>

            <div className="mb-3 flex justify-center">
              <div className="bg-white p-3 border-4 border-purple-500 animate-shake">
                <QRCode
                  value={`lightning:${LIGHTNING_ADDRESS}`}
                  size={140}
                  level="M"
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="bg-cyan-400 border-4 border-black p-2">
                <code className="text-xs text-black break-all font-mono font-bold">
                  {LIGHTNING_ADDRESS}
                </code>
              </div>
            </div>

            <button
              onClick={handleCopyLightning}
              className="w-full bg-purple-500 hover:bg-cyan-400 text-white hover:text-black font-black py-3 px-3 border-4 border-black transition-colors text-lg transform hover:scale-105"
            >
              {copiedLightning ? '✓ COPIED!' : '📋 COPY NOW'}
            </button>
          </div>

          {/* Alternative Payment Methods */}
          <div className="bg-black border-8 border-lime-400 p-4">
            <div className="text-center mb-3">
              <h2 className="text-2xl font-black text-lime-400 mb-1">
                $ TRADITIONAL
              </h2>
              <p className="text-sm text-pink-400 font-black bg-black px-2 py-1 border-2 border-pink-400 inline-block">BACKUP</p>
            </div>

            {/* Cash App */}
            <div className="mb-4 bg-lime-400 border-4 border-black p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-black text-black">CASH APP</h3>
                <span className="text-3xl">💵</span>
              </div>
              <div className="bg-black border-2 border-lime-400 p-2 mb-2">
                <code className="text-sm text-lime-400 font-mono font-black">
                  {CASHAPP_TAG}
                </code>
              </div>
              <button
                onClick={handleCopyCashApp}
                className="w-full bg-black hover:bg-lime-400 text-lime-400 hover:text-black font-black py-2 px-3 border-4 border-lime-400 transition-colors text-sm"
              >
                {copiedCashApp ? '✓ COPIED!' : '📋 COPY'}
              </button>
            </div>

            {/* Venmo */}
            <div className="bg-pink-400 border-4 border-black p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-black text-black">VENMO</h3>
                <span className="text-3xl">💳</span>
              </div>
              <div className="bg-black border-2 border-pink-400 p-2 mb-2">
                <code className="text-sm text-pink-400 font-mono font-black">
                  {VENMO_HANDLE}
                </code>
              </div>
              <button
                onClick={handleCopyVenmo}
                className="w-full bg-black hover:bg-pink-400 text-pink-400 hover:text-black font-black py-2 px-3 border-4 border-pink-400 transition-colors text-sm"
              >
                {copiedVenmo ? '✓ COPIED!' : '📋 COPY'}
              </button>
            </div>
          </div>
        </div>

        {/* Thank You */}
        <div className="text-center bg-black border-8 border-yellow-400 p-8 animate-pulse-crazy">
          <h3 className="text-4xl font-black text-yellow-400 mb-4 animate-blink">
            THANK YOU!!!
          </h3>
          <p className="text-2xl text-pink-500 font-black">
            EVERY DONATION KEEPS RIDERS ON THE TRACK! 🙏
          </p>
          <div className="mt-4 text-6xl animate-shake">🚴 💛 ⚡</div>
        </div>
      </div>
    </main>
  );
}

