// LandingPage.tsx
import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-700 via-purple-500 to-blue-900 text-white">
      {/* Header with Logo */}
      <header className="p-6">
        <div className="w-24 h-24 relative">
          <img src="/img/sentisoft-logo.svg" alt="SentiSoft Logo" className="w-full h-full" />
          <span className="text-xl font-bold absolute top-8 left-7 text-white">SentiSoft</span>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="flex flex-col lg:flex-row justify-between items-center py-8 px-8 lg:px-16 max-w-7xl mx-auto">
        {/* Left Side - Hero Text */}
        <div className="text-center lg:text-left lg:w-1/2 mb-12 lg:mb-0">
          <h1 className="text-5xl font-bold mb-6">
            Unlock Your Potential
          </h1>
          <p className="text-3xl mb-8">
            Elevate Your Soft Skills and<br />
            Open Doors to <span className="text-cyan-300">Top<br />Startups!</span>
          </p>
          
          <p className="mt-12 text-2xl">Associated with</p>
          <div className="mt-4 inline-block border-2 border-white rounded-md p-4 w-20 h-20 flex items-center justify-center">
            <span className="text-3xl font-bold">in</span>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="lg:w-1/3">
          <h2 className="text-4xl font-bold mb-8">Register now</h2>
          <input 
            type="text" 
            placeholder="Name" 
            className="block w-full p-4 mb-6 rounded-full bg-white text-black text-lg"
          />
          <input 
            type="email" 
            placeholder="E-mail" 
            className="block w-full p-4 mb-8 rounded-full bg-white text-black text-lg"
          />
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-full py-4 text-xl font-bold">
            Join Now!
          </button>
        </div>
      </section>

      {/* Why SentiSoft Section */}
      <section className="py-16 px-8 max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold mb-16 text-center">Why SentiSoft?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {/* AI Feature */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 mb-8">
              <img 
                src="/img/ai-icon.svg" 
                alt="AI" 
                className="w-full h-full"
              />
            </div>
            <p className="text-xl">
              Harness the Power of<br />
              AI for a Personalized,<br />
              Premium Experience
            </p>
          </div>
          
          {/* Group Feature */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 mb-8">
              <img 
                src="/img/group-icon.svg" 
                alt="Group" 
                className="w-full h-full"
              />
            </div>
            <p className="text-xl">
              Gain Access to<br />
              Opportunities with<br />
              Leading Startups
            </p>
          </div>
          
          {/* Free Tag Feature */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 mb-8">
              <img 
                src="/img/tag-icon.svg" 
                alt="Tag" 
                className="w-full h-full"
              />
            </div>
            <p className="text-xl">
              Enjoy a Completely<br />
              Free Experience
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;