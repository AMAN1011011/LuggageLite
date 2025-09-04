import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Clock, MapPin, Star, Users, Package, Truck, CheckCircle, Award, Globe, Plane, Train, Car, Route, Compass, Navigation, Map } from 'lucide-react';
import AnimatedCard, { FeatureCard, StatCard, TestimonialCard } from '../ui/AnimatedCard';
import AnimatedButton, { PrimaryButton, OutlineButton } from '../ui/AnimatedButton';
import LoadingSpinner from '../ui/LoadingSpinner';
import { 
  heroAnimation, 
  featureCardAnimation, 
  staggerContainer, 
  staggerItem,
  floatingElement 
} from '../../utils/animations';
import luggageHeroImage from '../../assets/images/luxury-travel-hero.png';
import imageBannerLuggage from '../../assets/images/image-banner-luggage.png';
import imageBannerMan from '../../assets/images/image-banner-man.png';
import step1Video from '../../assets/images/step1-booking.mp4';
import step2Video from '../../assets/images/step2-counter.mp4';
import step3Video from '../../assets/images/step3-pickup.mp4';

const Home = () => {
  const handleStartJourney = () => {
    window.location.hash = '#booking';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content - Left Side */}
            <motion.div
              {...heroAnimation}
              className="space-y-8"
            >
                              <div className="space-y-6">
                <motion.h1 
                    className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white leading-tight tracking-tight text-left"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Travel{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Light</span>,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Arrive</span>{' '}
                  Fresh
                </motion.h1>
                <motion.p 
                    className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg text-left"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  India's most trusted luggage transportation service. We handle your bags 
                  while you enjoy the journey stress-free.
                </motion.p>
              </div>
              
              <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <PrimaryButton 
                  size="large"
                  animationType="bounce"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => window.location.hash = '#booking'}
                >
                  Book Now
                </PrimaryButton>
                <OutlineButton 
                  size="large"
                  animationType="float"
                  onClick={() => window.location.hash = '#services'}
                >
                  Learn More
                </OutlineButton>
              </motion.div>

                <div className="flex items-center space-x-8 text-sm text-gray-600 dark:text-gray-400 justify-start">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span>On-Time Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-red-500" />
                  <span>Pan India</span>
                </div>
              </div>
            </motion.div>

            {/* Two Images Stacked Vertically - Right Side */}
            <div className="space-y-8">
              {/* Top Image */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
                {/* Neon Gradient Glow Effect - Blue to Purple */}
                <motion.div 
                  className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-75"
                  animate={{ 
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                ></motion.div>
                <motion.div 
                  className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-md opacity-50"
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.01, 1]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                ></motion.div>
                
                {/* Main Image Container */}
                <div className="relative rounded-2xl overflow-hidden h-[300px] shadow-2xl bg-white dark:bg-gray-900">
                <motion.img
                    src={imageBannerLuggage}
                    alt="Premium luggage transportation service with modern luggage handling and professional care - TravelLite's commitment to excellence"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-blue-400/30 ring-inset"></div>
              </div>
                

              </motion.div>

              {/* Bottom Image */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="relative"
              >
                {/* Neon Gradient Glow Effect - Purple to Cyan */}
                <motion.div 
                  className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur-lg opacity-75"
                  animate={{ 
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                ></motion.div>
                <motion.div 
                  className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-2xl blur-md opacity-50"
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.01, 1]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 1
                  }}
                ></motion.div>
                
                {/* Main Image Container */}
                <div className="relative rounded-2xl overflow-hidden h-[300px] shadow-2xl bg-white dark:bg-gray-900">
                  <motion.img
                    src={imageBannerMan}
                    alt="Professional luggage transportation service with dedicated staff and modern facilities - TravelLite's commitment to excellence"
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-purple-400/30 ring-inset"></div>
                </div>
                

              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { number: '50K+', label: 'Happy Customers', icon: Users, color: 'blue' },
              { number: 'All Top', label: 'Cities Covered in India', icon: MapPin, color: 'green' },
              { number: '99.9%', label: 'Success Rate', icon: Shield, color: 'purple' },
              { number: '24/7', label: 'Support', icon: Clock, color: 'orange' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
              >
                <StatCard
                  title={stat.label}
                  value={stat.number}
                  icon={stat.icon}
                  color={stat.color}
                  delay={index * 0.1}
                  animationType="scaleIn"
                  hoverable
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
              How TravelLite Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Simple, secure, and seamless luggage transportation in just a few steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Book Online',
                description: 'Select your source and destination stations, upload luggage photos, and complete booking',
                video: step1Video,
                alt: 'TravelLite booking process demonstration showing online station selection and luggage photo upload'
              },
              {
                step: '02',
                title: 'Drop at Counter',
                description: 'Visit our counter 30 minutes before departure and hand over your sealed luggage',
                video: step2Video,
                alt: 'TravelLite counter service showing luggage drop-off and sealing process at railway station'
              },
              {
                step: '03',
                title: 'Collect at Destination',
                description: 'Pick up your luggage at the destination counter using your booking ID',
                video: step3Video,
                alt: 'TravelLite luggage pickup process showing secure collection at destination counter'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="card text-center space-y-6 h-full">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                  </div>

                  {/* Video */}
                  <div className="relative rounded-lg overflow-hidden h-48 mt-6 shadow-lg">
                    <motion.video
                      src={item.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.05, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      aria-label={item.alt}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                    {/* Play indicator overlay for accessibility */}
                    <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary-500 to-secondary-500 overflow-hidden">
        {/* Background Travel Elements */}
        <div className="absolute inset-0 opacity-10">
          {/* Floating Map Icons */}
          <motion.div
            className="absolute top-10 left-10"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Map className="h-16 w-16 text-white" />
          </motion.div>
          
          <motion.div
            className="absolute top-20 right-20"
            animate={{ 
              y: [0, 10, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Globe className="h-12 w-12 text-white" />
          </motion.div>
          
          <motion.div
            className="absolute bottom-20 left-20"
            animate={{ 
              y: [0, -8, 0],
              x: [0, 5, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 2
            }}
          >
            <Compass className="h-14 w-14 text-white" />
          </motion.div>
          
          <motion.div
            className="absolute bottom-10 right-10"
            animate={{ 
              y: [0, 12, 0],
              x: [0, -3, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <Route className="h-10 w-10 text-white" />
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            {/* Main Heading */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
              Ready to Travel Light?
            </h2>
              <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Join thousands of satisfied customers who trust TravelLite for their luggage transportation needs.
            </p>
            </div>

            {/* Travel Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {[
                { icon: Train, label: 'Railway Stations', value: '50+', color: 'from-blue-500 to-purple-500' },
                { icon: Plane, label: 'Airports', value: '10+', color: 'from-purple-500 to-cyan-500' },
                { icon: MapPin, label: 'Cities', value: '15+', color: 'from-green-500 to-blue-500' },
                { icon: Users, label: 'Happy Travelers', value: '50K+', color: 'from-orange-500 to-red-500' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="relative group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Gradient Border Frame Effect */}
                  <motion.div 
                    className={`absolute -inset-1 bg-gradient-to-r ${stat.color} rounded-xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300`}
                    animate={{ 
                      opacity: [0.5, 0.8, 0.5],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: index * 0.5
                    }}
                  />
                  <motion.div 
                    className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
                    animate={{ 
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.01, 1]
                    }}
                    transition={{ 
                      duration: 2.5, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: index * 0.5 + 0.5
                    }}
                  />
                  
                  {/* Main Card with Gradient Border Frame */}
                  <div className="relative bg-transparent rounded-xl p-20 transition-all duration-300">
                    {/* Gradient Border Frame */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-xl p-[2px]`}>
                      <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl h-full w-full">
                        <div className="flex flex-col items-center justify-center h-full p-6 space-y-3">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <stat.icon className="h-8 w-8 text-white" />
                          </motion.div>
                          <motion.div 
                            className="text-2xl font-bold text-white"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            {stat.value}
                          </motion.div>
                          <div className="text-sm text-white/80 text-center">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
            <motion.button 
              onClick={handleStartJourney}
                className="bg-white text-primary-500 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Navigation className="h-5 w-5" />
                <span>Start Your Journey</span>
              </motion.button>
              
              <motion.button 
                className="border-2 border-white text-white hover:bg-white hover:text-primary-500 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
                <Map className="h-5 w-5" />
                <span>View Routes</span>
            </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="flex flex-wrap justify-center items-center gap-8 pt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-2 text-white/80">
                <Shield className="h-5 w-5" />
                <span className="text-sm">100% Secure</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <Clock className="h-5 w-5" />
                <span className="text-sm">On-Time Delivery</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <Award className="h-5 w-5" />
                <span className="text-sm">Award Winning</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Insured Service</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
