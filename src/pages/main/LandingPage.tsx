// LandingPage.tsx
import React from 'react';
import './landingPage.css' 

const LandingPage: React.FC = () => {
  return (
    <div className="landing-container">
      {/* Header with Logo */}
      <header className="header">
        <div className="logo-container">
          <div className="logo">
            <img src="/img/1.jpg" alt="SentiSoft Logo" />
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="hero-section">
        {/* Left Side - Hero Text */}
        <div className="hero-text">
          <h1>Unlock Your Potential
          
            Elevate Your <span className='highlight2'>Soft Skills</span> <br /> and
            Open Doors to <span className="highlight">Top<br />Startups!</span>
            </h1>
          
          
          <p className="association-text">Associated with</p>
          <div className="linkedin-box">
            <img src="/img/linkedin_logo.png" alt="linkedin_logo" />
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="registration-form">
          <h2>Register now</h2>
          <input 
            type="text" 
            placeholder="Name" 
            className="form-input"
          />
          <input 
            type="email" 
            placeholder="E-mail" 
            className="form-input"
          />
          <button className="join-button">
            Join Now!
          </button>
        </div>
      </section>

      {/* Why SentiSoft Section */}
      <section className="features-section">
        <h2>Why SentiSoft?</h2>
        
        <div className="features-grid">
          {/* AI Feature */}
          <div className="feature">
            <div className="feature-icon ai-icon">
              <div>AI</div>
            </div>
            <p>
              Harness the Power of<br />
              AI for a Personalized,<br />
              Premium Experience
            </p>
          </div>
          
          {/* Group Feature */}
          <div className="feature">
            <div className="feature-icon group-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
              </svg>
            </div>
            <p>
              Gain Access to<br />
              Opportunities with<br />
              Leading Startups
            </p>
          </div>
          
          {/* Free Tag Feature */}
          <div className="feature">
            <div className="feature-icon price-icon">
              <div>$0</div>
            </div>
            <p>
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