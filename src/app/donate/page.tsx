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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-yellow-500 hover:text-yellow-400 mb-8 transition-colors"
        >
          ← Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">💛 ₿ $</div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Support DEN BMX
          </h1>
          <p className="text-xl text-slate-300">
            Help buy a bike tube for my son
          </p>
        </div>

        {/* Story Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why Donate?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              DEN BMX is a passion project created to help BMX families in the
              Denver metro area stay connected with race schedules and events
              across Mile High, Dacono, and County Line tracks.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you find this site helpful, consider buying my son a bike tube!
              Your support helps keep young riders rolling. 🚴
            </p>
          </div>

          {/* Suggested Amount */}
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Suggested Amount
                </h3>
                <p className="text-3xl font-bold text-yellow-600">
                  ${SUGGESTED_AMOUNT}
                </p>
              </div>
              <div className="text-5xl">🚴</div>
            </div>
          </div>
        </div>

        {/* Bitcoin Preferred Badge */}
        <div className="bg-orange-500 text-white text-center py-2 px-4 rounded-lg mb-6 font-bold shadow-lg text-sm">
          ₿ Bitcoin Preferred
        </div>

        {/* Payment Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Bitcoin On-Chain */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="text-center mb-3">
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                ₿ Bitcoin
              </h2>
              <p className="text-xs text-orange-600 font-semibold">Recommended</p>
            </div>

            <div className="mb-3 flex justify-center">
              <div className="bg-white p-2 rounded-lg border-2 border-orange-400">
                <QRCode
                  value={`bitcoin:${BITCOIN_ADDRESS}`}
                  size={120}
                  level="M"
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="bg-gray-50 border border-gray-300 rounded p-2">
                <code className="text-xs text-gray-800 break-all font-mono">
                  {BITCOIN_ADDRESS}
                </code>
              </div>
            </div>

            <button
              onClick={handleCopyBitcoin}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
            >
              {copiedBitcoin ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>

          {/* Lightning Network */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="text-center mb-3">
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                ⚡ Lightning
              </h2>
              <p className="text-xs text-purple-600 font-semibold">Instant</p>
            </div>

            <div className="mb-3 flex justify-center">
              <div className="bg-white p-2 rounded-lg border-2 border-purple-400">
                <QRCode
                  value={`lightning:${LIGHTNING_ADDRESS}`}
                  size={120}
                  level="M"
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="bg-gray-50 border border-gray-300 rounded p-2">
                <code className="text-xs text-gray-800 break-all font-mono">
                  {LIGHTNING_ADDRESS}
                </code>
              </div>
            </div>

            <button
              onClick={handleCopyLightning}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
            >
              {copiedLightning ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>

          {/* Alternative Payment Methods */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="text-center mb-3">
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                $ Traditional
              </h2>
              <p className="text-xs text-gray-600 font-semibold">Alternative</p>
            </div>

            {/* Cash App */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">Cash App</h3>
                <span className="text-lg">💵</span>
              </div>
              <div className="bg-green-50 border border-green-300 rounded p-2 mb-2">
                <code className="text-xs text-gray-800 font-mono font-bold">
                  {CASHAPP_TAG}
                </code>
              </div>
              <button
                onClick={handleCopyCashApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm mb-3"
              >
                {copiedCashApp ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>

            {/* Venmo */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">Venmo</h3>
                <span className="text-lg">💳</span>
              </div>
              <div className="bg-blue-50 border border-blue-300 rounded p-2 mb-2">
                <code className="text-xs text-gray-800 font-mono font-bold">
                  {VENMO_HANDLE}
                </code>
              </div>
              <button
                onClick={handleCopyVenmo}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
              >
                {copiedVenmo ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Thank You */}
        <div className="text-center bg-slate-800 border border-slate-600 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            Thank You!
          </h3>
          <p className="text-slate-300">
            Every donation helps keep young riders on the track. Your support
            means the world to us. 🙏
          </p>
        </div>
      </div>
    </main>
  );
}

