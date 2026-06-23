import React from 'react';
import PageTemplate from '../../components/PageTemplate';

export default function TermsConditionsPage() {
  return (
    <PageTemplate title="Terms & Conditions" description="Please read carefully">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="prose prose-green max-w-none text-gray-700 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using our services, you accept and agree to be bound by the terms and provision of this agreement.
            If you do not agree to abide by the above, please do not use this service.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Booking and Payments</h2>
          <p className="mb-4">
            All Corbett Safari bookings are strictly subject to availability. Full payment is required in advance to confirm your booking.
            Prices are subject to change without prior notice.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Conduct</h2>
          <p className="mb-4">
            Visitors are expected to follow the guidelines of the Corbett Tiger Reserve. Any violation of park rules may lead to immediate
            cancellation of your safari without any refund. Alcohol and smoking are strictly prohibited inside the park.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Liability</h2>
          <p className="mb-4">
            We act only in the capacity of an agent for the visitors in all matters of transportation & accommodation.
            We shall not be responsible for any delay or change in schedule, loss, injury, or damage.
          </p>
        </div>
      </div>
    </PageTemplate>
  );
}
