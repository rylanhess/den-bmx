'use client';

import { useState } from 'react';
import Link from 'next/link';
import QRCode from 'react-qr-code';

const BITCOIN_ADDRESS = 'bc1qfqet3x22wgufxcdn8xusqktvgpyfk508wjdven';
const SUGGESTED_AMOUNT = 15;

export default function DonatePage() {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(BITCOIN_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
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
          <div className="text-6xl mb-4">💛</div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Support DEN BMX
          </h1>
          <p className="text-xl text-slate-300">
            Help buy a bike tube for my son
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          {/* Story */}
          <div className="mb-8">
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

          {/* Donation Info */}
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Suggested Amount
                </h3>
                <p className="text-3xl font-bold text-yellow-600">
                  ${SUGGESTED_AMOUNT}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  ~0.00015 BTC (approximate)
                </p>
              </div>
              <div className="text-5xl">🚴</div>
            </div>
          </div>

          {/* QR Code */}
          <div className="mb-6 flex justify-center">
            <div className="bg-white p-4 rounded-lg border-4 border-gray-200 shadow-lg">
              <QRCode
                value={`bitcoin:${BITCOIN_ADDRESS}`}
                size={200}
                level="M"
              />
            </div>
          </div>

          {/* Bitcoin Address */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
              Bitcoin Address
            </h3>
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
              <code className="text-sm text-gray-800 break-all font-mono">
                {BITCOIN_ADDRESS}
              </code>
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyAddress}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-4 px-6 rounded-lg transition-colors shadow-lg mb-4"
          >
            {copied ? '✓ Address Copied!' : '📋 Copy Bitcoin Address'}
          </button>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">How to Donate:</h4>
            <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
              <li>Scan the QR code with your Bitcoin wallet app, OR</li>
              <li>Copy the Bitcoin address above</li>
              <li>Open your Bitcoin wallet and paste the address</li>
              <li>Send any amount - every satoshi counts! 💛</li>
            </ol>
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

