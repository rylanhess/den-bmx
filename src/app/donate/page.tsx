'use client';

import { useState } from 'react';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import {
  HeartIcon,
  CircleStackIcon,
  CurrencyDollarIcon,
  BoltIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  CreditCardIcon,
  HandRaisedIcon
} from '@heroicons/react/24/solid';

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
    <main className="min-h-screen bg-black relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center bg-black text-[#00ff0c] active:text-white px-4 sm:px-6 py-3 border-4 border-[#00ff0c] font-black text-base sm:text-lg mb-4 sm:mb-6 transition-colors min-h-[44px]"
        >
          ← BACK TO HOME
        </Link>

        {/* Header - Professional Punk */}
        <div className="text-center mb-8">
          <div className="inline-block bg-black border-4 border-[#00ff0c] p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <HeartIcon className="w-16 h-16" />
              <CircleStackIcon className="w-16 h-16" />
              <CurrencyDollarIcon className="w-16 h-16" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-[#00ff0c] mb-2" style={{textShadow: '0 0 20px #00ff0c, 3px 3px 0px rgba(0,0,0,0.8)'}}>
              DONATE NOW!
            </h1>
            <div className="h-2 bg-[#00ff0c]"></div>
          </div>
          <p className="text-3xl text-white font-black bg-black px-6 py-3 inline-block border-4 border-[#00ff0c]">
            BUY MY SON A BIKE TUBE!
          </p>
        </div>

        {/* Story Card */}
        <div className="bg-black border-4 border-[#00ff0c] p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-3xl font-black text-[#00ff0c] mb-4">
              WHY DONATE?
            </h2>
            <p className="text-white leading-relaxed mb-4 font-bold text-lg">
              DEN BMX helps BMX families in Denver stay connected with race schedules across Mile High, Dacono, and County Line tracks.
            </p>
            <p className="text-[#00ff0c] leading-relaxed font-bold text-lg">
              Support keeps young riders rolling!
            </p>
          </div>

          {/* Suggested Amount */}
          <div className="bg-[#00ff0c] border-4 border-black p-6">
            <div className="flex items-center justify-between bg-black p-4 border-4 border-white">
              <div>
                <h3 className="text-xl font-black text-[#00ff0c]">
                  SUGGESTED AMOUNT
                </h3>
                <p className="text-6xl font-black text-white">
                  ${SUGGESTED_AMOUNT}
                </p>
              </div>
              <BoltIcon className="w-16 h-16" />
            </div>
          </div>
        </div>

        {/* Bitcoin Preferred Badge */}
        <div className="bg-black border-4 border-[#00ff0c] text-center py-4 px-6 mb-6 font-black text-2xl">
          <span className="text-[#00ff0c]">₿ BITCOIN PREFERRED ₿</span>
        </div>

        {/* Payment Options Grid - Professional Punk Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Bitcoin On-Chain */}
          <div className="bg-black border-4 border-[#00ff0c] p-4">
            <div className="text-center mb-3">
              <h2 className="text-2xl font-black text-[#00ff0c] mb-1">
                ₿ BITCOIN
              </h2>
              <p className="text-sm text-[#00ff0c] font-black bg-black px-2 py-1 border-2 border-[#00ff0c] inline-block">RECOMMENDED!</p>
            </div>

            <div className="mb-3 flex justify-center">
              <div className="bg-white p-3 border-4 border-[#00ff0c]">
                <QRCode
                  value={`bitcoin:${BITCOIN_ADDRESS}`}
                  size={140}
                  level="M"
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="bg-[#00ff0c] border-4 border-black p-2">
                <code className="text-xs text-black break-all font-mono font-bold">
                  {BITCOIN_ADDRESS}
                </code>
              </div>
            </div>

            <button
              onClick={handleCopyBitcoin}
              className="w-full bg-[#00ff0c] active:bg-white text-black font-black py-3 px-3 border-4 border-black transition-colors text-base sm:text-lg transform active:scale-95 min-h-[44px]"
            >
              {copiedBitcoin ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckIcon className="w-5 h-5" />
                  COPIED!
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ClipboardDocumentIcon className="w-5 h-5" />
                  COPY NOW
                </span>
              )}
            </button>
          </div>

          {/* Lightning Network */}
          <div className="bg-black border-4 border-[#00ff0c] p-4">
            <div className="text-center mb-3">
              <h2 className="text-2xl font-black text-[#00ff0c] mb-1 flex items-center justify-center gap-2">
                <BoltIcon className="w-6 h-6" />
                LIGHTNING
              </h2>
              <p className="text-sm text-[#00ff0c] font-black bg-black px-2 py-1 border-2 border-[#00ff0c] inline-block">INSTANT!</p>
            </div>

            <div className="mb-3 flex justify-center">
              <div className="bg-white p-3 border-4 border-[#00ff0c]">
                <QRCode
                  value={`lightning:${LIGHTNING_ADDRESS}`}
                  size={140}
                  level="M"
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="bg-[#00ff0c] border-4 border-black p-2">
                <code className="text-xs text-black break-all font-mono font-bold">
                  {LIGHTNING_ADDRESS}
                </code>
              </div>
            </div>

            <button
              onClick={handleCopyLightning}
              className="w-full bg-[#00ff0c] active:bg-white text-black font-black py-3 px-3 border-4 border-black transition-colors text-base sm:text-lg transform active:scale-95 min-h-[44px]"
            >
              {copiedLightning ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckIcon className="w-5 h-5" />
                  COPIED!
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ClipboardDocumentIcon className="w-5 h-5" />
                  COPY NOW
                </span>
              )}
            </button>
          </div>

          {/* Alternative Payment Methods */}
          <div className="bg-black border-4 border-[#00ff0c] p-4">
            <div className="text-center mb-3">
              <h2 className="text-2xl font-black text-[#00ff0c] mb-1">
                $ TRADITIONAL
              </h2>
              <p className="text-sm text-white font-black bg-black px-2 py-1 border-2 border-white inline-block">BACKUP</p>
            </div>

            {/* Cash App */}
            <div className="mb-4 bg-[#00ff0c] border-4 border-black p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-black text-black">CASH APP</h3>
                <CurrencyDollarIcon className="w-8 h-8" />
              </div>
              <div className="bg-black border-2 border-[#00ff0c] p-2 mb-2">
                <code className="text-sm text-[#00ff0c] font-mono font-black">
                  {CASHAPP_TAG}
                </code>
              </div>
              <button
                onClick={handleCopyCashApp}
                className="w-full bg-black active:bg-[#00ff0c] text-[#00ff0c] active:text-black font-black py-2 px-3 border-4 border-[#00ff0c] transition-colors text-sm min-h-[44px]"
              >
                {copiedCashApp ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckIcon className="w-4 h-4" />
                    COPIED!
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ClipboardDocumentIcon className="w-4 h-4" />
                    COPY
                  </span>
                )}
              </button>
            </div>

            {/* Venmo */}
            <div className="bg-white border-4 border-black p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-black text-black">VENMO</h3>
                <CreditCardIcon className="w-8 h-8" />
              </div>
              <div className="bg-black border-2 border-white p-2 mb-2">
                <code className="text-sm text-white font-mono font-black">
                  {VENMO_HANDLE}
                </code>
              </div>
              <button
                onClick={handleCopyVenmo}
                className="w-full bg-black active:bg-white text-white active:text-black font-black py-2 px-3 border-4 border-white transition-colors text-sm min-h-[44px]"
              >
                {copiedVenmo ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckIcon className="w-4 h-4" />
                    COPIED!
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ClipboardDocumentIcon className="w-4 h-4" />
                    COPY
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Thank You */}
        <div className="text-center bg-black border-4 border-[#00ff0c] p-8">
          <h3 className="text-4xl font-black text-[#00ff0c] mb-4">
            THANK YOU!!!
          </h3>
          <p className="text-2xl text-white font-black">
            EVERY DONATION KEEPS RIDERS ON THE TRACK!
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <BoltIcon className="w-12 h-12" />
            <HeartIcon className="w-12 h-12" />
            <BoltIcon className="w-12 h-12" />
          </div>
        </div>
      </div>
    </main>
  );
}

