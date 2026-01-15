/**
 * Visual mockup of Stripe checkout form for page builder
 * Shows what the real checkout will look like without being functional
 */

export function CheckoutFormMockup() {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg border-2 border-dashed border-blue-300">
      <div className="mb-4 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Checkout Form Preview - Configure products in Settings</span>
      </div>

      <h2 className="text-2xl font-bold mb-6">Complete Your Purchase</h2>
      
      {/* Email Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-400">
          customer@example.com
        </div>
      </div>

      {/* Card Information */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card information
        </label>
        <div className="border border-gray-300 rounded-md overflow-hidden">
          <div className="flex items-center px-3 py-2 bg-gray-50 border-b border-gray-300">
            <div className="flex-1 text-gray-400">1234 5678 9012 3456</div>
            <div className="flex gap-1">
              <div className="w-8 h-5 bg-blue-600 rounded"></div>
              <div className="w-8 h-5 bg-red-600 rounded"></div>
              <div className="w-8 h-5 bg-yellow-500 rounded"></div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1 px-3 py-2 bg-gray-50 border-r border-gray-300 text-gray-400">
              MM / YY
            </div>
            <div className="flex-1 px-3 py-2 bg-gray-50 text-gray-400">
              CVC
            </div>
          </div>
        </div>
      </div>

      {/* Cardholder Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cardholder name
        </label>
        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-400">
          John Doe
        </div>
      </div>

      {/* Billing Address */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Billing address
        </label>
        <div className="space-y-3">
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-400">
            United States
          </div>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-400">
            123 Main Street
          </div>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-400">
            Apt, suite, etc. (optional)
          </div>
          <div className="flex gap-3">
            <div className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-400">
              City
            </div>
            <div className="w-24 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-400">
              State
            </div>
            <div className="w-32 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-400">
              ZIP
            </div>
          </div>
        </div>
      </div>

      {/* Pay Button */}
      <button
        disabled
        className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold opacity-50 cursor-not-allowed"
      >
        Pay Now
      </button>

      {/* Powered by Stripe */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
        <span>Powered by</span>
        <svg className="h-4" viewBox="0 0 60 25" fill="currentColor">
          <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z"/>
        </svg>
      </div>
    </div>
  );
}
