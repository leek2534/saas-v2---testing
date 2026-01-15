"use client";

import { useState } from "react";

/**
 * Preview version of checkout form for page builder
 * Shows interactive mockup that looks like real Stripe
 */
export function CheckoutPreview() {
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("US");
  const [zip, setZip] = useState("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? ' / ' + v.substring(2, 4) : '');
    }
    return v;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg border-2 border-dashed border-blue-300">
      <div className="mb-4 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Preview Mode - Interactive checkout form</span>
      </div>

      <h2 className="text-2xl font-bold mb-6">Complete Your Purchase</h2>
      
      {/* Email Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="customer@example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Card Information */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Card information</label>
        <div className="border border-gray-300 rounded-md overflow-hidden">
          <div className="flex items-center px-3 py-2 bg-white border-b border-gray-300">
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="flex-1 outline-none"
            />
            <div className="flex gap-1">
              <div className="w-8 h-5 bg-blue-600 rounded"></div>
              <div className="w-8 h-5 bg-red-600 rounded"></div>
              <div className="w-8 h-5 bg-yellow-500 rounded"></div>
            </div>
          </div>
          <div className="flex">
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM / YY"
              maxLength={7}
              className="flex-1 px-3 py-2 bg-white border-r border-gray-300 outline-none"
            />
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, '').substring(0, 4))}
              placeholder="CVC"
              maxLength={4}
              className="flex-1 px-3 py-2 bg-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* Cardholder Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cardholder name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Billing Address */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Billing address</label>
        <div className="space-y-3">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
          </select>
          <input
            type="text"
            placeholder="Address line 1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Address line 2 (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="City"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="State"
              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/[^0-9]/g, '').substring(0, 5))}
              placeholder="ZIP"
              maxLength={5}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Pay Button */}
      <button
        disabled
        className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold opacity-50 cursor-not-allowed"
      >
        Pay Now (Preview Mode)
      </button>

      {/* Powered by Stripe */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
        <span>Powered by</span>
        <svg className="h-4" viewBox="0 0 60 25" fill="currentColor">
          <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z"/>
        </svg>
      </div>

      {/* Info */}
      <div className="mt-4 text-center text-xs text-gray-500">
        <p>This is an interactive preview. Try entering card details!</p>
        <p className="mt-1">Real Stripe checkout will appear on live funnel pages.</p>
      </div>
    </div>
  );
}
