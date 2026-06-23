import React from 'react';
import PageTemplate from '../../components/PageTemplate';

export default function BestTimeToVisitPage() {
  return (
    <PageTemplate title="Best Time to Visit" description="Plan your trip for the best sightings">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="prose prose-green max-w-none text-gray-700 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Seasons in Jim Corbett</h2>
          <p className="mb-4">
            Jim Corbett National Park experiences three distinct seasons: Winter, Summer, and Monsoon. 
            The park remains closed during the heavy monsoon season from July to October.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="border p-4 rounded-lg">
              <h3 className="font-bold text-lg text-green-700">Winter (November to February)</h3>
              <p>Excellent time for bird watching and spotting Tigers, as the visibility is clear. The weather is cool and pleasant.</p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-bold text-lg text-green-700">Summer (March to June)</h3>
              <p>Best visibility for Tiger sightings as animals come out near water bodies. The weather can be hot but mornings are ideal.</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Zone Wise Opening Dates</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Dhikala Zone:</strong> 15th November to 15th June</li>
            <li><strong>Bijrani Zone:</strong> 15th October to 30th June</li>
            <li><strong>Jhirna & Dhela Zones:</strong> Open all year round (subject to weather conditions)</li>
          </ul>
        </div>
      </div>
    </PageTemplate>
  );
}
