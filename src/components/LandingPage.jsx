import React from 'react';
import { Atom, BookOpen, Play, Target, Lightbulb, Users } from 'lucide-react';
import './LandingPage.css';

const LandingPage = ({ onStartLearning }) => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <Atom size={32} />
            <span>AtomLearn</span>
          </div>
          <nav className="nav">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#topics">Topics</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>
                Explore the <span className="highlight">Atomic World</span> in 3D
              </h1>
              <p>
                Dive deep into atomic structure with our interactive 3D visualization. 
                Perfect for Class 10 students to understand atoms, electrons, and energy levels 
                through immersive learning.
              </p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={onStartLearning}>
                  <Play size={20} />
                  Start Learning
                </button>
                <button className="btn-secondary">
                  <BookOpen size={20} />
                  View Curriculum
                </button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="atom-preview">
                <div className="nucleus"></div>
                <div className="electron-orbit orbit-1">
                  <div className="electron"></div>
                </div>
                <div className="electron-orbit orbit-2">
                  <div className="electron"></div>
                </div>
                <div className="electron-orbit orbit-3">
                  <div className="electron"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2>Why Choose Interactive Learning?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <Target size={48} />
              <h3>Interactive 3D Models</h3>
              <p>Rotate, zoom, and explore atomic structures in real-time 3D space</p>
            </div>
            <div className="feature-card">
              <Lightbulb size={48} />
              <h3>Visual Learning</h3>
              <p>Complex concepts made simple through engaging visual representations</p>
            </div>
            <div className="feature-card">
              <Users size={48} />
              <h3>Class 10 Focused</h3>
              <p>Content specifically designed for Class 10 physics curriculum</p>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section id="topics" className="topics">
        <div className="container">
          <h2>What You'll Learn</h2>
          <div className="topics-grid">
            <div className="topic-card active">
              <h3>Atomic Structure</h3>
              <ul>
                <li>Nucleus composition (protons & neutrons)</li>
                <li>Electron shells and energy levels</li>
                <li>Atomic number and mass number</li>
                <li>Electron configuration</li>
              </ul>
            </div>
            <div className="topic-card">
              <h3>Interactive Features</h3>
              <ul>
                <li>3D atom visualization</li>
                <li>Clickable components</li>
                <li>Real-time information display</li>
                <li>Smooth animations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Explore Atoms?</h2>
          <p>Join thousands of students learning chemistry through interactive 3D experiences</p>
          <button className="btn-primary large" onClick={onStartLearning}>
            <Play size={24} />
            Start Your Journey
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <Atom size={24} />
              <span>AtomLearn</span>
            </div>
            <p>© 2025 AtomLearn. Interactive education for the future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
