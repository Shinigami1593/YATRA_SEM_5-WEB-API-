<template>
  <div class="homepage">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="hero-grid"></div>
        <div class="hero-particles">
          <div class="particle" v-for="n in 15" :key="n"></div>
        </div>
      </div>
      
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              Navigate Your Journey with
              <span class="gradient-text">Yatra</span>
            </h1>
            <p class="hero-subtitle">
              Experience the future of smart navigation. Get real-time transit updates, 
              personalized routes, and seamless travel planning across Canada and beyond.
            </p>
            
            <div class="hero-actions">
              <button class="cta-primary" @click="$emit('navigate', 'signup')">
                <i class="bi bi-rocket-takeoff"></i>
                Start Your Journey
              </button>
              <button class="cta-secondary" @click="scrollToFeatures">
                <i class="bi bi-play-circle"></i>
                Watch Demo
              </button>
            </div>
            
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">{{ animatedStats.users }}+</span>
                <span class="stat-label">Active Users</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ animatedStats.cities }}+</span>
                <span class="stat-label">Cities</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ animatedStats.uptime }}%</span>
                <span class="stat-label">Uptime</span>
              </div>
            </div>
          </div>
          
          <div class="hero-visual">
            <div class="phone-mockup">
              <div class="phone-screen">
                <div class="app-interface">
                  <div class="app-header">
                    <div class="app-logo">
                      <i class="bi bi-compass"></i>
                    </div>
                    <span>Yatra</span>
                  </div>
                  <div class="map-area">
                    <div class="route-line" :class="{ 'animated': isRouteAnimated }"></div>
                    <div class="location-pin start">
                      <i class="bi bi-geo-alt-fill"></i>
                    </div>
                    <div class="location-pin end">
                      <i class="bi bi-flag-fill"></i>
                    </div>
                    <div class="transit-icons">
                      <div class="transit-icon bus" :class="{ 'moving': isBusMoving }">
                        <i class="bi bi-bus-front"></i>
                      </div>
                      <div class="transit-icon train" :class="{ 'moving': isTrainMoving }">
                        <i class="bi bi-train-front"></i>
                      </div>
                    </div>
                  </div>
                  <div class="route-info">
                    <div class="route-detail">
                      <span class="route-time">{{ currentRoute.time }} min</span>
                      <span class="route-type">{{ currentRoute.type }}</span>
                    </div>
                    <div class="route-detail">
                      <span class="route-distance">{{ currentRoute.distance }} km</span>
                      <span class="route-cost">${{ currentRoute.cost }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section" id="features">
      <div class="section-container">
        <div class="section-header">
          <h2>Why Choose Yatra?</h2>
          <p>Discover the features that make Yatra the perfect travel companion</p>
        </div>
        
        <div class="features-container">
          <div 
            class="feature-card" 
            v-for="(feature, index) in features" 
            :key="feature.id"
            :class="{ 'visible': visibleFeatures[index] }"
            ref="featureCards"
          >
            <div class="feature-icon">
              <i :class="feature.icon"></i>
            </div>
            <div class="feature-content">
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
              <div class="feature-highlight">
                <span>{{ feature.highlight }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works-section">
      <div class="section-container">
        <div class="section-header">
          <h2>How Yatra Works</h2>
          <p>Get started in three simple steps</p>
        </div>
        
        <div class="steps-container">
          <div 
            class="step" 
            v-for="(step, index) in steps" 
            :key="step.id"
            :class="{ 'active': activeStep >= index }"
          >
            <div class="step-header">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-icon">
                <i :class="step.icon"></i>
              </div>
            </div>
            <div class="step-content">
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
            <div class="step-connector" v-if="index < steps.length - 1">
              <div class="connector-line" :class="{ 'completed': activeStep > index }"></div>
              <div class="connector-arrow">
                <i class="bi bi-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="services-section">
      <div class="section-container">
        <div class="section-header">
          <h2>Our Services</h2>
          <p>Comprehensive transit solutions for every journey</p>
        </div>
        
        <div class="services-container">
          <div class="service-card" v-for="service in services" :key="service.id">
            <div class="service-header">
              <div class="service-icon">
                <i :class="service.icon"></i>
              </div>
              <h3>{{ service.title }}</h3>
            </div>
            <div class="service-content">
              <p>{{ service.description }}</p>
              <div class="service-features">
                <div class="service-feature" v-for="feature in service.features" :key="feature">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>{{ feature }}</span>
                </div>
              </div>
              <button class="service-btn" @click="learnMore(service.id)">
                Learn More
                <i class="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="section-container">
        <div class="section-header">
          <h2>What Our Users Say</h2>
          <p>Join thousands of satisfied travelers</p>
        </div>
        
        <div class="testimonials-container">
          <div 
            class="testimonial-card" 
            v-for="(testimonial, index) in displayedTestimonials" 
            :key="testimonial.id"
            :class="{ 'featured': index === featuredTestimonial }"
          >
            <div class="testimonial-header">
              <div class="quote-icon">
                <i class="bi bi-quote"></i>
              </div>
              <div class="rating">
                <i class="bi bi-star-fill" v-for="n in testimonial.rating" :key="n"></i>
              </div>
            </div>
            <div class="testimonial-content">
              <p>"{{ testimonial.content }}"</p>
            </div>
            <div class="testimonial-footer">
              <div class="author-info">
                <div class="author-avatar">
                  <i class="bi bi-person-circle"></i>
                </div>
                <div class="author-details">
                  <h4>{{ testimonial.name }}</h4>
                  <span>{{ testimonial.location }}</span>
                </div>
              </div>
              <div class="testimonial-badge">
                <i class="bi bi-patch-check-fill"></i>
                <span>Verified User</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="testimonial-controls">
          <button 
            class="testimonial-dot" 
            v-for="(testimonial, index) in testimonials" 
            :key="testimonial.id"
            :class="{ 'active': index === currentTestimonialSet }"
            @click="changeTestimonialSet(index)"
          ></button>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="section-container">
        <div class="stats-container">
          <div class="stat-card" v-for="stat in stats" :key="stat.id">
            <div class="stat-icon">
              <i :class="stat.icon"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stat.number }}</div>
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-description">{{ stat.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-background">
        <div class="cta-pattern"></div>
      </div>
      <div class="section-container">
        <div class="cta-content">
          <div class="cta-text">
            <h2>Ready to Transform Your Travel Experience?</h2>
            <p>Join thousands of users who have already discovered the power of smart navigation</p>
          </div>
          <div class="cta-actions">
            <button class="cta-primary large" @click="$emit('navigate', 'signup')">
              <i class="bi bi-person-plus"></i>
              Get Started Free
            </button>
            <button class="cta-secondary large" @click="$emit('navigate', 'contact')">
              <i class="bi bi-chat-dots"></i>
              Contact Sales
            </button>
          </div>
          <div class="cta-features">
            <div class="cta-feature">
              <i class="bi bi-check-circle-fill"></i>
              <span>Free forever plan</span>
            </div>
            <div class="cta-feature">
              <i class="bi bi-check-circle-fill"></i>
              <span>No credit card required</span>
            </div>
            <div class="cta-feature">
              <i class="bi bi-check-circle-fill"></i>
              <span>Setup in minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <i class="bi bi-hourglass-split"></i>
      </div>
      <p>Loading your journey...</p>
    </div>

    <!-- Notification Toast -->
    <div v-if="notification.show" class="notification-toast" :class="notification.type">
      <i :class="notification.icon"></i>
      <span>{{ notification.message }}</span>
      <button @click="closeNotification" class="close-btn">
        <i class="bi bi-x"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue'

// Reactive data
const isLoading = ref(false)
const activeStep = ref(0)
const currentTestimonialSet = ref(0)
const featuredTestimonial = ref(0)
const visibleFeatures = ref([])
const isRouteAnimated = ref(false)
const isBusMoving = ref(false)
const isTrainMoving = ref(false)

// Animated stats
const animatedStats = reactive({
  users: 0,
  cities: 0,
  uptime: 0
})

const targetStats = {
  users: 10000,
  cities: 50,
  uptime: 99.9
}

// Current route data
const currentRoute = reactive({
  time: 12,
  type: 'Fastest',
  distance: 2.3,
  cost: 3.50
})

// Notification system
const notification = reactive({
  show: false,
  type: 'success',
  message: '',
  icon: 'bi bi-check-circle-fill'
})

// Features data
const features = ref([
  {
    id: 1,
    icon: 'bi bi-geo-alt-fill',
    title: 'Smart Navigation',
    description: 'Get real-time directions with AI-powered route optimization that adapts to traffic, weather, and transit schedules.',
    highlight: 'AI-Powered'
  },
  {
    id: 2,
    icon: 'bi bi-clock-fill',
    title: 'Live Updates',
    description: 'Stay informed with real-time transit information, delays, and alternative routes to keep you moving.',
    highlight: 'Real-Time'
  },
  {
    id: 3,
    icon: 'bi bi-shield-check-fill',
    title: 'Secure & Reliable',
    description: 'Your data is protected with enterprise-grade security and 99.9% uptime guarantee.',
    highlight: '99.9% Uptime'
  },
  {
    id: 4,
    icon: 'bi bi-people-fill',
    title: 'Community Driven',
    description: 'Benefit from crowd-sourced updates and community-verified information for accurate transit data.',
    highlight: 'Community'
  },
  {
    id: 5,
    icon: 'bi bi-phone-fill',
    title: 'Offline Support',
    description: 'Access maps and basic navigation even without internet connection for uninterrupted travel.',
    highlight: 'Offline Ready'
  },
  {
    id: 6,
    icon: 'bi bi-heart-fill',
    title: 'Personalized',
    description: 'Learn your preferences and suggest routes tailored to your travel patterns and preferences.',
    highlight: 'Smart Learning'
  }
])

// Steps data
const steps = ref([
  {
    id: 1,
    icon: 'bi bi-download',
    title: 'Download & Install',
    description: 'Get the Yatra app from your preferred app store and create your free account in seconds.'
  },
  {
    id: 2,
    icon: 'bi bi-geo-alt',
    title: 'Set Your Location',
    description: 'Allow location access and set your home, work, and favorite destinations for quick access.'
  },
  {
    id: 3,
    icon: 'bi bi-compass',
    title: 'Start Navigating',
    description: 'Enter your destination and let Yatra guide you with the best routes and real-time updates.'
  }
])

// Services data
const services = ref([
  {
    id: 1,
    icon: 'bi bi-bus-front',
    title: 'Public Transit',
    description: 'Complete public transportation integration with real-time schedules and route planning.',
    features: ['Real-time arrivals', 'Route optimization', 'Fare information', 'Accessibility options']
  },
  {
    id: 2,
    icon: 'bi bi-car-front',
    title: 'Multi-Modal Travel',
    description: 'Seamlessly combine walking, cycling, driving, and public transit for optimal journeys.',
    features: ['Mixed transport modes', 'Cost comparison', 'Time optimization', 'Carbon footprint tracking']
  },
  {
    id: 3,
    icon: 'bi bi-building',
    title: 'Enterprise Solutions',
    description: 'Custom solutions for businesses, organizations, and municipalities.',
    features: ['Custom integrations', 'Analytics dashboard', 'Employee commute planning', '24/7 support']
  }
])

// Testimonials data
const testimonials = ref([
  {
    id: 1,
    name: 'Sarah Chen',
    location: 'Toronto, ON',
    content: 'Yatra has completely transformed how I navigate the city. The real-time updates are incredibly accurate and have saved me countless hours.',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    location: 'Vancouver, BC',
    content: 'As someone who relies on public transit daily, Yatra is a game-changer. The offline maps feature is perfect for underground stations.',
    rating: 5
  },
  {
    id: 3,
    name: 'Emily Johnson',
    location: 'Montreal, QC',
    content: 'The multi-modal planning is fantastic. I love how it combines walking, metro, and bus routes to find the most efficient path.',
    rating: 5
  },
  {
    id: 4,
    name: 'David Kim',
    location: 'Calgary, AB',
    content: 'Yatra\'s community features make it stand out. Real users sharing real-time updates makes all the difference.',
    rating: 5
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    location: 'Ottawa, ON',
    content: 'The accessibility features are outstanding. Finally, a navigation app that considers all users\' needs.',
    rating: 5
  },
  {
    id: 6,
    name: 'James Wilson',
    location: 'Halifax, NS',
    content: 'Simple, reliable, and incredibly useful. Yatra has become an essential part of my daily routine.',
    rating: 5
  }
])

// Stats data
const stats = ref([
  {
    id: 1,
    icon: 'bi bi-people-fill',
    number: '10K+',
    label: 'Happy Users',
    description: 'Active monthly users across Canada'
  },
  {
    id: 2,
    icon: 'bi bi-geo-alt-fill',
    number: '50+',
    label: 'Cities Covered',
    description: 'Major metropolitan areas supported'
  },
  {
    id: 3,
    icon: 'bi bi-clock-fill',
    number: '99.9%',
    label: 'Uptime',
    description: 'Reliable service you can count on'
  },
  {
    id: 4,
    icon: 'bi bi-award-fill',
    number: '4.8★',
    label: 'App Rating',
    description: 'Average rating across all platforms'
  }
])

// Computed properties
const displayedTestimonials = computed(() => {
  const start = currentTestimonialSet.value * 3
  return testimonials.value.slice(start, start + 3)
})

// Methods
const scrollToFeatures = () => {
  const element = document.getElementById('features')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const learnMore = (serviceId) => {
  showNotification('info', 'More information coming soon!', 'bi bi-info-circle-fill')
}

const changeTestimonialSet = (index) => {
  currentTestimonialSet.value = index
}

const showNotification = (type, message, icon) => {
  notification.type = type
  notification.message = message
  notification.icon = icon
  notification.show = true
  
  setTimeout(() => {
    notification.show = false
  }, 4000)
}

const closeNotification = () => {
  notification.show = false
}

const animateStats = () => {
  const duration = 2000
  const steps = 60
  const stepDuration = duration / steps
  
  let currentStep = 0
  
  const interval = setInterval(() => {
    const progress = currentStep / steps
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    
    animatedStats.users = Math.floor(targetStats.users * easeOutQuart)
    animatedStats.cities = Math.floor(targetStats.cities * easeOutQuart)
    animatedStats.uptime = Math.floor(targetStats.uptime * easeOutQuart * 10) / 10
    
    currentStep++
    
    if (currentStep > steps) {
      clearInterval(interval)
      animatedStats.users = targetStats.users
      animatedStats.cities = targetStats.cities
      animatedStats.uptime = targetStats.uptime
    }
  }, stepDuration)
}

const animateSteps = () => {
  let currentStepIndex = 0
  
  const stepInterval = setInterval(() => {
    if (currentStepIndex < steps.value.length) {
      activeStep.value = currentStepIndex
      currentStepIndex++
    } else {
      clearInterval(stepInterval)
    }
  }, 1000)
}

const animateRoute = () => {
  // Animate route line
  isRouteAnimated.value = true
  
  // Animate transit icons
  setTimeout(() => {
    isBusMoving.value = true
  }, 500)
  
  setTimeout(() => {
    isTrainMoving.value = true
  }, 1000)
  
  // Update route information
  setTimeout(() => {
    currentRoute.time = Math.floor(Math.random() * 10) + 8
    currentRoute.distance = (Math.random() * 3 + 1).toFixed(1)
    currentRoute.cost = (Math.random() * 2 + 2.5).toFixed(2)
  }, 1500)
}

const cycleTestimonials = () => {
  setInterval(() => {
    featuredTestimonial.value = (featuredTestimonial.value + 1) % 3
  }, 4000)
  
  setInterval(() => {
    currentTestimonialSet.value = (currentTestimonialSet.value + 1) % Math.ceil(testimonials.value.length / 3)
  }, 12000)
}

const observeFeatures = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = Array.from(entry.target.parentNode.children).indexOf(entry.target)
        visibleFeatures.value[index] = true
      }
    })
  }, { threshold: 0.1 })
  
  // We'll observe elements after they're mounted
  setTimeout(() => {
    const featureElements = document.querySelectorAll('.feature-card')
    featureElements.forEach((el) => observer.observe(el))
  }, 100)
}

// Lifecycle hooks
onMounted(() => {
  // Initialize animations
  setTimeout(() => {
    animateStats()
    animateSteps()
    animateRoute()
    cycleTestimonials()
    observeFeatures()
  }, 500)
  
  // Initialize visible features array
  visibleFeatures.value = new Array(features.value.length).fill(false)
  
  // Show welcome notification
  setTimeout(() => {
    showNotification('success', 'Welcome to Yatra! Explore our features below.', 'bi bi-heart-fill')
  }, 2000)
})

onUnmounted(() => {
  // Clean up any intervals or observers if needed
})

// Watchers
watch(currentTestimonialSet, (newVal) => {
  featuredTestimonial.value = 0
})

// Emit events
const emit = defineEmits(['navigate'])
</script>

<style scoped>
.homepage {
  width: 100vw;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%);
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.hero-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(0, 214, 100, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 214, 100, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.3;
}

.hero-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #00D664;
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.particle:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
.particle:nth-child(2) { top: 80%; left: 20%; animation-delay: 1s; }
.particle:nth-child(3) { top: 40%; left: 80%; animation-delay: 2s; }
.particle:nth-child(4) { top: 60%; left: 70%; animation-delay: 3s; }
.particle:nth-child(5) { top: 30%; left: 50%; animation-delay: 4s; }

@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); opacity: 0.7; }
  50% { transform: translateY(-20px) scale(1.1); opacity: 1; }
}

.hero-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-content {
  display: flex;
  align-items: center;
  gap: 4rem;
  min-height: 80vh;
}

.hero-text {
  flex: 1;
  color: #ffffff;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, #00D664 0%, #00C956 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #a0a0a0;
  margin-bottom: 2.5rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.cta-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #00D664 0%, #00C956 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 214, 100, 0.4);
}

.cta-primary.large {
  padding: 1.25rem 2.5rem;
  font-size: 1.1rem;
}

.cta-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: transparent;
  color: #ffffff;
  border: 2px solid #333333;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-secondary:hover {
  border-color: #00D664;
  background: rgba(0, 214, 100, 0.1);
}

.cta-secondary.large {
  padding: 1.25rem 2.5rem;
  font-size: 1.1rem;
}

.hero-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #00D664;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #a0a0a0;
}

/* Hero Visual */
.hero-visual {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.phone-mockup {
  width: 300px;
  height: 600px;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border-radius: 30px;
  padding: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;
}

.phone-mockup::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: #666666;
  border-radius: 2px;
}

.phone-screen {
  width: 100%;
  height: 100%;
  background: #000000;
  border-radius: 20px;
  overflow: hidden;
}

.app-interface {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.app-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  color: #ffffff;
  font-weight: 600;
}

.app-logo {
  width: 30px;
  height: 30px;
  background: #00D664;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.map-area {
  flex: 1;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border-radius: 12px;
  position: relative;
  margin-bottom: 1rem;
  overflow: hidden;
}

.route-line {
  position: absolute;
  top: 50%;
  left: 20%;
  right: 20%;
  height: 3px;
  background: linear-gradient(90deg, #00D664 0%, #00C956 100%);
  border-radius: 2px;
  transform: translateY(-50%);
  transition: all 0.5s ease;
}

.route-line.animated {
  animation: routePulse 2s ease-in-out infinite;
}

@keyframes routePulse {
  0%, 100% { opacity: 1; transform: translateY(-50%) scaleX(1); }
  50% { opacity: 0.7; transform: translateY(-50%) scaleX(1.1); }
}

.location-pin {
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  animation: pinBounce 2s ease-in-out infinite;
}

@keyframes pinBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.location-pin.start {
  top: 40%;
  left: 15%;
  background: #00D664;
}

.location-pin.end {
  top: 40%;
  right: 15%;
  background: #ef4444;
}

.transit-icons {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  gap: 10px;
}

.transit-icon {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.transit-icon.moving {
  animation: iconMove 3s ease-in-out infinite;
}

@keyframes iconMove {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(10px); }
}

.transit-icon.bus {
  background: #3b82f6;
}

.transit-icon.train {
  background: #f59e0b;
}

.route-info {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(0, 214, 100, 0.1);
  border-radius: 8px;
}

.route-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.route-time,
.route-distance {
  color: #00D664;
  font-weight: 600;
  font-size: 1rem;
}

.route-type,
.route-cost {
  color: #a0a0a0;
  font-size: 0.8rem;
}

/* Sections */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
}

.section-header p {
  font-size: 1.1rem;
  color: #a0a0a0;
  max-width: 600px;
  margin: 0 auto;
}

/* Features Section */
.features-section {
  background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
  width: 100%;
}

.features-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.feature-card {
  flex: 1;
  min-width: 300px;
  max-width: 350px;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(0, 214, 100, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.5s ease;
  opacity: 0;
  transform: translateY(30px);
}

.feature-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 214, 100, 0.4);
  box-shadow: 0 10px 30px rgba(0, 214, 100, 0.2);
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #00D664 0%, #00C956 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: white;
}

.feature-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1rem;
}

.feature-content p {
  color: #a0a0a0;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.feature-highlight {
  padding: 0.5rem 1rem;
  background: rgba(0, 214, 100, 0.1);
  border-radius: 20px;
  color: #00D664;
  font-size: 0.9rem;
  font-weight: 500;
}

/* How It Works Section */
.how-it-works-section {
  background: linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%);
  width: 100%;
}

.steps-container {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  justify-content: space-between;
}

.step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  opacity: 0.5;
  transition: all 0.5s ease;
}

.step.active {
  opacity: 1;
  transform: scale(1.05);
}

.step-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

.step-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #00D664 0%, #00C956 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
}

.step-icon {
  width: 80px;
  height: 80px;
  background: rgba(0, 214, 100, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #00D664;
}

.step-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1rem;
}

.step-content p {
  color: #a0a0a0;
  line-height: 1.6;
}

.step-connector {
  position: absolute;
  top: 30px;
  right: -50%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.connector-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #333333 100%);
  transition: all 0.5s ease;
}

.connector-line.completed {
  background: linear-gradient(90deg, #00D664 0%, #00C956 100%);
}

.connector-arrow {
  color: #333333;
  font-size: 1.5rem;
  margin-left: 10px;
  transition: color 0.5s ease;
}

.step.active + .step .connector-arrow {
  color: #00D664;
}

/* Services Section */
.services-section {
  background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
  width: 100%;
}

.services-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.service-card {
  flex: 1;
  min-width: 300px;
  max-width: 350px;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border-radius: 16px;
  border: 1px solid rgba(0, 214, 100, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 214, 100, 0.4);
  box-shadow: 0 10px 30px rgba(0, 214, 100, 0.2);
}

.service-header {
  padding: 2rem 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.service-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #00D664 0%, #00C956 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: white;
}

.service-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
}

.service-content {
  padding: 0 2rem 2rem;
}

.service-content p {
  color: #a0a0a0;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.service-features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.service-feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a0a0a0;
  font-size: 0.9rem;
}

.service-feature i {
  color: #00D664;
  font-size: 1rem;
}

.service-btn {
  width: 100%;
  padding: 0.875rem;
  background: transparent;
  color: #00D664;
  border: 2px solid #00D664;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.service-btn:hover {
  background: #00D664;
  color: white;
}

/* Testimonials Section */
.testimonials-section {
  background: linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%);
  width: 100%;
}

.testimonials-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.testimonial-card {
  flex: 1;
  min-width: 300px;
  max-width: 350px;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(0, 214, 100, 0.2);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.testimonial-card.featured {
  border-color: rgba(0, 214, 100, 0.6);
  box-shadow: 0 10px 30px rgba(0, 214, 100, 0.3);
  transform: scale(1.02);
}

.testimonial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.quote-icon {
  width: 40px;
  height: 40px;
  background: #00D664;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.rating {
  color: #f59e0b;
  display: flex;
  gap: 2px;
}

.testimonial-content {
  flex: 1;
  margin-bottom: 1.5rem;
}

.testimonial-content p {
  color: #ffffff;
  font-size: 1.1rem;
  line-height: 1.6;
  font-style: italic;
}

.testimonial-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  font-size: 2.5rem;
  color: #00D664;
}

.author-details h4 {
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.author-details span {
  color: #a0a0a0;
  font-size: 0.9rem;
}

.testimonial-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #00D664;
  font-size: 0.8rem;
}

.testimonial-controls {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.testimonial-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #333333;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.testimonial-dot.active {
  background: #00D664;
  transform: scale(1.2);
}

/* Stats Section */
.stats-section {
  background: linear-gradient(135deg, #00D664 0%, #00C956 100%);
  width: 100%;
}

.stats-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.stat-card {
  flex: 1;
  min-width: 250px;
  max-width: 280px;
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: white;
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.stat-description {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #00D664 0%, #00C956 100%);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.cta-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.cta-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 2px, transparent 2px);
  background-size: 50px 50px;
}

.cta-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: white;
}

.cta-text h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-text p {
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.cta-actions .cta-primary {
  background: white;
  color: #00D664;
}

.cta-actions .cta-primary:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.cta-actions .cta-secondary {
  border-color: white;
  color: white;
}

.cta-actions .cta-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

.cta-features {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.cta-feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  color: white;
}

.loading-spinner {
  font-size: 3rem;
  color: #00D664;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Notification Toast */
.notification-toast {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: #2a2a2a;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  border-left: 4px solid #00D664;
}

.notification-toast.success {
  border-left-color: #10b981;
}

.notification-toast.info {
  border-left-color: #3b82f6;
}

.notification-toast.warning {
  border-left-color: #f59e0b;
}

.notification-toast.error {
  border-left-color: #ef4444;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.close-btn {
  background: none;
  border: none;
  color: #a0a0a0;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  margin-left: 0.5rem;
}

.close-btn:hover {
  color: white;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-content {
    flex-direction: column;
    gap: 3rem;
    text-align: center;
  }
  
  .hero-title {
    font-size: 3rem;
  }
  
  .steps-container {
    flex-direction: column;
    gap: 3rem;
  }
  
  .step-connector {
    display: none;
  }
}

@media (max-width: 768px) {
  .section-container {
    padding: 4rem 1rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .phone-mockup {
    width: 250px;
    height: 500px;
  }
  
  .features-container,
  .services-container,
  .testimonials-container,
  .stats-container {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-features {
    flex-direction: column;
    align-items: center;
  }
  
  .notification-toast {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .section-header h2 {
    font-size: 2rem;
  }
  
  .cta-text h2 {
    font-size: 2rem;
  }
}
</style>