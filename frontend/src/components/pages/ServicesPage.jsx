import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Shield, 
  Truck, 
  Train, 
  Package, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Phone,
  Mail,
  Info
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ServicesPage = () => {
  const { isDarkMode } = useTheme();

  const steps = [
    {
      step: '01',
      title: 'Book Online',
      description: 'Select your source and destination stations, choose your preferred time, and complete your booking securely online.',
      details: [
        'Visit our website and click "Book Now"',
        'Select departure and arrival stations',
        'Choose your preferred pickup time',
        'Upload clear photos of your luggage',
        'Enter contact details and complete payment',
        'Receive instant booking confirmation'
      ],
      icon: Package,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      step: '02',
      title: 'Drop at Counter',
      description: 'Visit our designated counter at the railway station 30 minutes before departure to hand over your luggage.',
      details: [
        'Arrive at station 30 minutes before departure',
        'Locate our TravelLite counter (clearly marked)',
        'Present your booking ID and ID proof',
        'Hand over your sealed luggage',
        'Receive luggage receipt and tracking details',
        'Luggage is securely stored and loaded'
      ],
      icon: Truck,
      color: 'from-green-500 to-emerald-500'
    },
    {
      step: '03',
      title: 'Journey & Tracking',
      description: 'Your luggage travels safely with real-time tracking updates throughout the journey.',
      details: [
        'Luggage travels in secure compartments',
        'Real-time tracking via SMS/email',
        'Professional handling by trained staff',
        'Climate-controlled storage when needed',
        '24/7 monitoring and security',
        'Insurance coverage throughout journey'
      ],
      icon: Train,
      color: 'from-purple-500 to-pink-500'
    },
    {
      step: '04',
      title: 'Collect at Destination',
      description: 'Pick up your luggage at the destination counter using your booking ID and ID proof.',
      details: [
        'Visit our counter at destination station',
        'Present booking ID and ID proof',
        'Verify luggage condition and contents',
        'Sign receipt and collect luggage',
        'Provide feedback on your experience',
        'Enjoy your stress-free journey!'
      ],
      icon: CheckCircle,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const importantNotices = [
    {
      type: 'warning',
      title: 'Late Luggage Delivery',
      message: 'If your luggage arrives late, we will deliver it to your destination location within 24 hours at no extra cost.',
      icon: AlertTriangle,
      color: 'from-yellow-400 to-orange-500'
    },
    {
      type: 'info',
      title: 'Luggage Insurance',
      message: 'All luggage is automatically insured up to ₹10,000 during transit. Additional coverage available.',
      icon: Shield,
      color: 'from-blue-400 to-indigo-500'
    },
    {
      type: 'success',
      title: '24/7 Support',
      message: 'Our customer support team is available 24/7 to assist you with any queries or concerns.',
      icon: Phone,
      color: 'from-green-400 to-teal-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white">
              Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Services
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover how TravelLite makes your journey stress-free with our comprehensive luggage transportation service
            </p>
          </motion.div>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              How It Works - Step by Step
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Your journey from booking to collection, simplified in 4 easy steps
            </p>
          </motion.div>

          {/* Road Map with Train */}
          <div className="relative mb-20">
            {/* Train Track */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 transform -translate-y-1/2 z-0"></div>
            
            {/* Train */}
            <motion.div
              animate={{ x: [0, '100%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 transform -translate-y-1/2 z-10"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg shadow-lg">
                <Train className="h-6 w-6 text-white" />
              </div>
            </motion.div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-20">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-30">
                    <div className={`bg-gradient-to-r ${step.color} text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg`}>
                      {step.step}
                    </div>
                  </div>

                  {/* Step Card */}
                  <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 h-full`}>
                    <div className="text-center space-y-4">
                      <div className={`bg-gradient-to-r ${step.color} p-4 rounded-xl inline-block`}>
                        <step.icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {step.description}
                      </p>

                      {/* Detailed Steps */}
                      <div className="text-left space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-start space-x-2">
                            <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {detail}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Notices */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Important Information
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Essential details you need to know about our service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {importantNotices.map((notice, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative group"
              >
                {/* Glowing Background Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${notice.color} rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Notice Card */}
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                  <div className="text-center space-y-4">
                    <div className={`bg-gradient-to-r ${notice.color} p-4 rounded-xl inline-block`}>
                      <notice.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {notice.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300">
                      {notice.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Why Choose TravelLite?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Experience the difference with our premium service features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: '100% Secure',
                description: 'Your luggage is fully insured and handled with utmost care throughout the journey.',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: Clock,
                title: 'On-Time Delivery',
                description: 'We guarantee timely delivery with real-time tracking and updates.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: MapPin,
                title: 'Pan India Coverage',
                description: 'Service available across all major railway stations in India.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: Phone,
                title: '24/7 Support',
                description: 'Round-the-clock customer support for all your queries and concerns.',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: Package,
                title: 'Professional Handling',
                description: 'Trained staff ensures your luggage is handled with professional care.',
                color: 'from-indigo-500 to-purple-500'
              },
              {
                icon: CheckCircle,
                title: 'Quality Assured',
                description: 'We maintain the highest standards of service quality and customer satisfaction.',
                color: 'from-teal-500 to-green-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-center space-y-4">
                  <div className={`bg-gradient-to-r ${feature.color} p-4 rounded-xl inline-block`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
              Ready to Experience Stress-Free Travel?
            </h2>
            <p className="text-xl text-white/90">
              Book your luggage transportation service now and enjoy a worry-free journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                onClick={() => window.location.hash = '#booking'}
              >
                Book Now
              </motion.button>
                             <motion.a
                 href="https://www.linkedin.com/in/amanv10/"
                 target="_blank"
                 rel="noopener noreferrer"
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors cursor-pointer inline-block text-center"
               >
                 Contact Us
               </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
