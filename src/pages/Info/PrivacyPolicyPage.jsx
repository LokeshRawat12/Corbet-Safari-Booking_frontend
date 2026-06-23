import React from 'react';
import PageTemplate from '../../components/PageTemplate';

export default function PrivacyPolicyPage() {
  return (
    <PageTemplate title="Privacy Policy" description="Valid from 2026">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="prose prose-green max-w-none text-gray-700 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <p className="font-semibold text-gray-500 mb-6">Last Updated: April 2026</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Collection of Information</h2>
          <p className="mb-4">
            We collect personal information that you voluntarily provide to us when you register on the 
            website, express an interest in obtaining information about us or our products and services, 
            when you participate in activities on the website or otherwise when you contact us.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Use of Your Information</h2>
          <p className="mb-4">
            We use personal information collected via our website for a variety of business purposes 
            described below. We process your personal information for these purposes in reliance on our 
            legitimate business interests, in order to enter into or perform a contract with you, with 
            your consent, and/or for compliance with our legal obligations.
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>To facilitate account creation and logon process.</li>
            <li>To send administrative information to you.</li>
            <li>To fulfill and manage your orders and bookings.</li>
          </ul>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Security</h2>
          <p className="mb-4">
            We aim to protect your personal information through a system of organizational and technical 
            security measures. However, no electronic transmission over the internet or information 
            storage technology can be guaranteed to be 100% secure.
          </p>
        </div>
      </div>
    </PageTemplate>
  );
}
