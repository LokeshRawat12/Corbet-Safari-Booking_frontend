import React from 'react';
import PageTemplate from '../../components/PageTemplate';

export default function CancellationPolicyPage() {
  return (
    <PageTemplate title="Cancellation Policy" description="Understanding our refund rules">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="prose prose-green max-w-none text-gray-700 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Safari Cancellation</h2>
          <p className="mb-4 font-semibold text-red-600">
            Please note: All Corbett Safari bookings are non-refundable and non-transferable.
          </p>
          <p className="mb-4">
            Once confirmed, a safari booking cannot be cancelled, modified, or postponed. The forest department does not allow
            any refunds for cancelled safaris under any circumstances, even in the event of bad weather or sudden park closures.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hotel & Package Cancellation</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>30 days or more before arrival:</strong> 75% refund of total package cost.</li>
            <li><strong>15 to 29 days before arrival:</strong> 50% refund of total package cost.</li>
            <li><strong>7 to 14 days before arrival:</strong> 25% refund of total package cost.</li>
            <li><strong>Less than 7 days before arrival:</strong> No refund.</li>
          </ul>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Refund Process</h2>
          <p className="mb-4">
            Approved refunds will be processed within 7-10 business days and credited to the original method of payment.
          </p>
        </div>
      </div>
    </PageTemplate>
  );
}
