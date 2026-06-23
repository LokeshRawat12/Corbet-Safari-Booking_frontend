import React from 'react';
import PageTemplate from '../../components/PageTemplate';

export default function TigerConservationPage() {
  return (
    <PageTemplate title="Tiger Conservation" description="Project Tiger in Jim Corbett">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="prose prose-green max-w-none text-gray-700 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <img 
            src="https://images.unsplash.com/photo-1596706798150-51a83b483dd6?fit=crop&w=800&q=80" 
            alt="Bengal Tiger" 
            className="w-full h-64 object-cover rounded-lg mb-6 shadow-md"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Tiger</h2>
          <p className="mb-4">
            Project Tiger is a tiger conservation programme launched in November 1973 by the Government of India in 
            Jim Corbett National Park. It was established to ensure the survival and maintenance of the tiger 
            population in specially constituted tiger reserves across India.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Role & Responsibility</h2>
          <p className="mb-4">
            As visitors, it is our prime duty to help preserve the pristine flora and fauna of the park. 
            By following park guidelines, staying on designated paths, and minimizing noise/pollution, 
            we actively contribute to Tiger Conservation. A thriving tiger population means a thriving natural ecosystem.
          </p>
          <blockquote className="border-l-4 border-green-600 pl-4 py-2 mt-6 bg-green-50 rounded-r-lg italic">
            "The tiger is entirely a creature of its environment. To save the tiger, you must save its home."
          </blockquote>
        </div>
      </div>
    </PageTemplate>
  );
}
