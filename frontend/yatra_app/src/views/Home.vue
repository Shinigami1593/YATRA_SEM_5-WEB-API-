<template>
  <div class="homepage">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background">
        <div class="floating-elements">
          <div class="floating-icon" v-for="n in 6" :key="n" :style="getFloatingStyle(n)">
            <i :class="getRandomIcon()"></i>
          </div>
        </div>
      </div>
      
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <i class="bi bi-star-fill"></i>
            <span>Trusted by 50,000+ travelers</span>
          </div>
          
          <h1 class="hero-title">
            Your Journey Starts with
            <span class="gradient-text">Yatra</span>
          </h1>
          
          <p class="hero-description">
            Experience seamless travel planning with real-time updates, smart routing, 
            and personalized recommendations. Join thousands of travelers who trust Yatra 
            for their daily commutes and adventures.
          </p>
          
          <div class="hero-actions">
            <button @click="$emit('navigate', 'signup')" class="btn-primary">
              <i class="bi bi-rocket-takeoff"></i>
              Start Your Journey
            </button>
            <button @click="scrollToFeatures" class="btn-secondary">
              <i class="bi bi-play-circle"></i>
              Watch Demo
            </button>
          </div>
          
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">50K+</span>
              <span class="stat-label">Active Users</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">100+</span>
              <span class="stat-label">Cities</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">99.9%</span>
              <span class="stat-label">Uptime</span>
            </div>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="phone-mockup">
            <div class="phone-screen">
              <div class="app-interface">
                <div class="app-header">
                  <div class="status-bar">
                    <span>9:41</span>
                    <div class="signal-icons">
                      <i class="bi bi-wifi"></i>
                      <i class="bi bi-battery-full"></i>
                    </div>
                  </div>
                  <div class="app-title">
                    <h3>Yatra</h3>
                    <i class="bi bi-geo-alt-fill"></i>
                  </div>
                </div>
                <div class="map-area">
                  <div class="route-line"></div>
                  <div class="location-pin start">
                    <i class="bi bi-geo-alt-fill"></i>
                  </div>
                  <div class="location-pin end">
                    <i class="bi bi-flag-fill"></i>
                  </div>
                </div>
                <div class="trip-info">
                  <div class="trip-time">
                    <i class="bi bi-clock"></i>
                    <span>12 min</span>
                  </div>
                  <div class="trip-distance">
                    <i class="bi bi-speedometer2"></i>
                    <span>3.2 km</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section ref="featuresSection" class="features">
      <div class="container">
        <div class="section-header">
          <h2>Why Choose Yatra?</h2>
          <p>Discover the features that make your travel experience extraordinary</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card" v-for="(feature, index) in features" :key="index" 
               :style="{ animationDelay: `${index * 0.1}s` }">
            <div class="feature-icon">
              <i :class="feature.icon"></i>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
            <div class="feature-highlight">
              <span>{{ feature.highlight }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works">
      <div class="container">
        <div class="section-header">
          <h2>How Yatra Works</h2>
          <p>Get started in just three simple steps</p>
        </div>
        
        <div class="steps-container">
          <div class="step" v-for="(step, index) in steps" :key="index">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <div class="step-icon">
                <i :class="step.icon"></i>
              </div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
            <div v-if="index < steps.length - 1" class="step-connector"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials">
      <div class="container">
        <div class="section-header">
          <h2>What Our Users Say</h2>
          <p>Real experiences from real travelers</p>
        </div>
        
        <div class="testimonials-grid">
          <div class="testimonial-card" v-for="(testimonial, index) in testimonials" :key="index">
            <div class="testimonial-content">
              <div class="quote-icon">
                <i class="bi bi-quote"></i>
              </div>
              <p>"{{ testimonial.content }}"</p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">
                <i class="bi bi-person-circle"></i>
              </div>
              <div class="author-info">
                <h4>{{ testimonial.name }}</h4>
                <span>{{ testimonial.role }}</span>
              </div>
              <div class="rating">
                <i v-for="n in 5" :key="n" class="bi bi-star-fill"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Transform Your Travel Experience?</h2>
          <p>Join thousands of satisfied travelers and start your journey with Yatra today.</p>
          <div class="cta-actions">
            <button @click="$emit('navigate', 'signup')" class="btn-primary large">
              <i class="bi bi-download"></i>
              Get Started Free
            </button>
            <button @click="$emit('navigate', 'contact')" class="btn-outline">
              <i class="bi bi-chat-dots"></i>
              Contact Sales
            </button>
          </div>
          <div class="cta-note">
            <i class="bi bi-shield-check"></i>
            <span>No credit card required • Free 30-day trial</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Define emits
defineEmits(['navigate'])

const featuresSection = ref(null)

const features = [
  {
    icon: 'bi bi-geo-alt-fill',
    title: 'Smart Navigation',
    description: 'AI-powered route optimization that learns from real-time traffic patterns and your preferences.',
    highlight: 'Save 25% travel time'
  },
  {
    icon: 'bi bi-clock-history',
    title: 'Real-time Updates',
    description: 'Get instant notifications about delays, route changes, and alternative paths.',
    highlight: 'Live tracking'
  },
  {
    icon: 'bi bi-shield-check',
    title: 'Safe & Secure',
    description: 'Your privacy and data security are our top priorities with end-to-end encryption.',
    highlight: 'Bank-level security'
  },
  {
    icon: 'bi bi-lightning-charge',
    title: 'Lightning Fast',
    description: 'Optimized performance ensures quick loading times and smooth user experience.',
    highlight: '< 2s load time'
  },
  {
    icon: 'bi bi-people-fill',
    title: 'Community Driven',
    description: 'Benefit from crowd-sourced data and community reports for better travel insights.',
    highlight: '50K+ contributors'
  },
  {
    icon: 'bi bi-phone',
    title: 'Cross Platform',
    description: 'Available on all devices with seamless synchronization across platforms.',
    highlight: 'iOS, Android, Web'
  }
]

const steps = [
  {
    icon: 'bi bi-person-plus',
    title: 'Sign Up',
    description: 'Create your free account in less than 30 seconds with just your email.'
  },
  {
    icon: 'bi bi-geo-alt',
    title: 'Set Destination',
    description: 'Enter your destination and let our AI find the best route for you.'
  },
  {
    icon: 'bi bi-play-circle',
    title: 'Start Journey',
    description: 'Follow turn-by-turn directions with real-time updates and notifications.'
  }
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Daily Commuter',
    content: 'Yatra has completely transformed my daily commute. The real-time updates saved me from countless traffic jams!'
  },
  {
    name: 'Mike Rodriguez',
    role: 'Business Traveler',
    content: 'As someone who travels frequently for work, Yatra\'s reliability and accuracy are unmatched. Highly recommended!'
  },
  {
    name: 'Emily Johnson',
    role: 'Student',
    content: 'The app is so intuitive and fast. I love how it learns my preferences and suggests better routes over time.'
  }
]

const icons = [
  'bi bi-airplane',
  'bi bi-train-front',
  'bi bi-bus-front',
  'bi bi-bicycle',
  'bi bi-car-front',
  'bi bi-geo-alt'
]

const getRandomIcon = () => {
  return icons[Math.floor(Math.random() * icons.length)]
}

const getFloatingStyle = (index) => {
  const positions = [
    { top: '10%', left: '10%' },
    { top: '20%', right: '15%' },
    { top: '60%', left: '5%' },
    { top: '70%', right: '10%' },
    { top: '40%', left: '15%' },
    { top: '80%', right: '20%' }
  ]
  
  return {
    ...positions[index - 1],
    animationDelay: `${index * 0.5}s`,
    animationDuration: `${3 + index}s`
  }
}

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// Load Bootstrap Icons
onMounted(() => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css'
  document.head.appendChild(link)
})
</script>

<style scoped>
.homepage {
  background-color: #0f0f0f;
  color: #ffffff;
  overflow-x: hidden;
}

/* Hero Section */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%);
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
}

.floating-elements {
  position: relative;
  width: 100%;
  height: 100%;
}

.floating-icon {
  position: absolute;
  font-size: 2rem;
  color: rgba(0, 214, 100, 0.1);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.hero-container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 214, 100, 0.1);
  border: 1px solid rgba(0, 214, 100, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  color: #00D664;
  margin-bottom: 2rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 214, 100, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(0, 214, 100, 0); }
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, #00D664 0%, #00F070 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.2rem;
  color: #a0a0a0;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.btn-primary, .btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #00D664 0%, #00C956 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 214, 100, 0.4);
}

.btn-secondary {
  background: transparent;
  color: #00D664;
  border: 2px solid #00D664;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 214, 100, 0.5);
}

.btn-secondary:hover {
  background: rgba(0, 214, 100, 0.1);
  transform: translateY(-2px);
}

.hero-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #00D664;
}

.stat-label {
  font-size: 0.875rem;
  color: #666666;
}

/* Phone Mockup */
.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.phone-mockup {
  width: 280px;
  height: 560px;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border-radius: 30px;
  padding: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: phoneFloat 3s ease-in-out infinite;
}

@keyframes phoneFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.phone-screen {
  width: 100%;
  height: 100%;
  background: #000000;
  border-radius: 20px;
  overflow: hidden;
}

.app-interface {
  height: 100%;
  background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
  padding: 1rem;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.signal-icons {
  display: flex;
  gap: 0.5rem;
}

.app-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #00D664;
  margin-bottom: 2rem;
}

.map-area {
  position: relative;
  height: 200px;
  background: linear-gradient(45deg, #2a2a2a, #333333);
  border-radius: 12px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.route-line {
  position: absolute;
  top: 50%;
  left: 20%;
  right: 20%;
  height: 3px;
  background: linear-gradient(90deg, #00D664, #00F070);
  border-radius: 2px;
  animation: routeGlow 2s ease-in-out infinite;
}

@keyframes routeGlow {
  0%, 100% { box-shadow: 0 0 5px rgba(0, 214, 100, 0.5); }
  50% { box-shadow: 0 0 15px rgba(0, 214, 100, 0.8); }
}

.location-pin {
  position: absolute;
  color: #00D664;
  font-size: 1.5rem;
  animation: pinBounce 1s ease-in-out infinite;
}

.location-pin.start {
  top: 40%;
  left: 15%;
}

.location-pin.end {
  top: 40%;
  right: 15%;
}

@keyframes pinBounce {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

.trip-info {
  display: flex;
  justify-content: space-around;
  background: #2a2a2a;
  padding: 1rem;
  border-radius: 8px;
}

.trip-time, .trip-distance {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffffff;
}

/* Sections */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff;
}

.section-header p {
  font-size: 1.1rem;
  color: #a0a0a0;
}

/* Features Section */
.features {
  padding: 6rem 0;
  background: #1a1a1a;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: #2a2a2a;
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(0, 214, 100, 0.2);
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 214, 100, 0.4);
  box-shadow: 0 10px 30px rgba(0, 214, 100, 0.1);
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #00D664, #00C956);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.feature-icon i {
  font-size: 1.5rem;
  color: white;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ffffff;
}

.feature-card p {
  color: #a0a0a0;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.feature-highlight {
  display: inline-block;
  background: rgba(0, 214, 100, 0.1);
  color: #00D664;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

/* How It Works Section */
.how-it-works {
  padding: 6rem 0;
  background: #0f0f0f;
}

.steps-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
}

.step {
  flex: 1;
  text-align: center;
  position: relative;
}

.step-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #00D664, #00C956);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0 auto 2rem;
}

.step-icon {
  width: 80px;
  height: 80px;
  background: #2a2a2a;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  border: 2px solid rgba(0, 214, 100, 0.2);
}

.step-icon i {
  font-size: 2rem;
  color: #00D664;
}

.step h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ffffff;
}

.step p {
  color: #a0a0a0;
  line-height: 1.6;
}

.step-connector {
  position: absolute;
  top: 30px;
  left: 60%;
  right: -40%;
  height: 2px;
  background: linear-gradient(90deg, #00D664, transparent);
  z-index: -1;
}

/* Testimonials Section */
.testimonials {
  padding: 6rem 0;
  background: #1a1a1a;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.testimonial-card {
  background: #2a2a2a;
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(0, 214, 100, 0.2);
}

.testimonial-content {
  margin-bottom: 2rem;
}

.quote-icon {
  color: #00D664;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.testimonial-content p {
  color: #e0e0e0;
  line-height: 1.6;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar i {
  font-size: 2.5rem;
  color: #00D664;
}

.author-info h4 {
  color: #ffffff;
  margin-bottom: 0.25rem;
}

.author-info span {
  color: #a0a0a0;
  font-size: 0.875rem;
}

.rating {
  margin-left: auto;
  color: #ffd700;
}

/* CTA Section */
.cta-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, #00D664 0%, #00C956 100%);
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

.cta-content p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-primary.large {
  padding: 1.25rem 2.5rem;
  font-size: 1.1rem;
  background: white;
  color: #00D664;
}

.btn-outline {
  background: transparent;
  color: white;
  border: 2px solid white;
  padding: 1.25rem 2.5rem;
  font-size: 1.1rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: white;
  color: #00D664;
  transform: translateY(-2px);
}

.cta-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .phone-mockup {
    width: 240px;
    height: 480px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .steps-container {
    flex-direction: column;
    gap: 3rem;
  }

  .step-connector {
    display: none;
  }

  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .cta-actions {
    flex-direction: column;
    align-items: center;
  }

  .section-header h2 {
    font-size: 2rem;
  }
}
</style>