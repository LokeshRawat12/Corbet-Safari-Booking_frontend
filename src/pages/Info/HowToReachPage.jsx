import React from 'react';
import PageTemplate from '../../components/PageTemplate';

export default function HowToReachPage() {
  return (
    <PageTemplate title="How to Reach" description="Getting to Jim Corbett National Park">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="bg-blue-100 px-3 py-2 rounded-full text-blue-600 text-2xl" aria-label="car">
              🚗
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">By Road</h3>
              <p className="text-gray-700">
                Ramnagar is well connected by road to major North Indian cities. It is approximately 260 km from Delhi. 
                The route from Delhi: Hapur - Moradabad - Kashipur - Ramnagar. The journey takes about 5-6 hours by car.
              </p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="bg-green-100 px-3 py-2 rounded-full text-green-600 text-2xl" aria-label="train">
              🚆
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">By Train</h3>
              <p className="text-gray-700">
                Ramnagar is the nearest railway station (about 12 km from the park entrance). A direct train to Ramnagar 
                runs from New Delhi (Ranikhet Express). Alternatively, you can take a train to Moradabad or Haldwani and 
                then travel by taxi.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="bg-orange-100 px-3 py-2 rounded-full text-orange-600 text-2xl" aria-label="plane">
              ✈️
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">By Air</h3>
              <p className="text-gray-700">
                The nearest domestic airport is Pantnagar Airport, approximately 80 km from Ramnagar. 
                The nearest international airport is Indira Gandhi International Airport (DEL) in New Delhi, around 260 km away.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
