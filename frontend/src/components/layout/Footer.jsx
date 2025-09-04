import React from 'react';
import { motion } from 'framer-motion';
import { Luggage, Mail, Phone, MapPin, Github, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { isDarkMode } = useTheme();

  return (
    <footer className={`mt-20 border-t-2 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700 text-white' 
        : 'bg-gray-50 border-gray-200 text-gray-900'
    } transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-primary-500 p-2 rounded-lg">
                <Luggage className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-xl font-display font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Travel<span className="text-primary-500">Lite</span>
              </h3>
            </div>
            <p className={`text-sm leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              India's trusted luggage transportation service. Travel light, arrive fresh. 
              We handle your luggage while you enjoy the journey.
            </p>
            <div className="flex space-x-4">
                             <motion.a 
                 href="https://github.com/AMAN1011011" 
                 target="_blank"
                 rel="noopener noreferrer"
                 className={`hover:text-primary-400 transition-colors ${
                   isDarkMode ? 'text-gray-400' : 'text-gray-500'
                 }`}
                 whileHover={{ scale: 1.2 }}
               >
                 <Github className="h-5 w-5" />
               </motion.a>
               <motion.a 
                 href="https://x.com/aman1011011" 
                 target="_blank"
                 rel="noopener noreferrer"
                 className={`hover:text-primary-400 transition-colors ${
                   isDarkMode ? 'text-gray-400' : 'text-gray-500'
                 }`}
                 whileHover={{ scale: 1.2 }}
               >
                 <Twitter className="h-5 w-5" />
               </motion.a>
               <motion.a 
                 href="https://www.instagram.com/amanverma.rar/" 
                 target="_blank"
                 rel="noopener noreferrer"
                 className={`hover:text-primary-400 transition-colors ${
                   isDarkMode ? 'text-gray-400' : 'text-gray-500'
                 }`}
                 whileHover={{ scale: 1.2 }}
               >
                 <Instagram className="h-5 w-5" />
               </motion.a>
               <motion.a 
                 href="https://www.linkedin.com/in/amanv10/" 
                 target="_blank"
                 rel="noopener noreferrer"
                 className={`hover:text-primary-400 transition-colors ${
                   isDarkMode ? 'text-gray-400' : 'text-gray-500'
                 }`}
                 whileHover={{ scale: 1.2 }}
               >
                 <Linkedin className="h-5 w-5" />
               </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className={`hover:text-primary-400 transition-colors text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Home</a></li>
              <li><a href="#booking" className={`hover:text-primary-400 transition-colors text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Book Now</a></li>
              <li><a href="#services" className={`hover:text-primary-400 transition-colors text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Services</a></li>
              <li><a href="#counter" className={`hover:text-primary-400 transition-colors text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Staff Portal</a></li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Support</h4>
            <ul className="space-y-2">
              <li><a href="#help" className={`hover:text-primary-400 transition-colors text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Help Center</a></li>
              <li><a href="#terms" className={`hover:text-primary-400 transition-colors text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Terms of Service</a></li>
              <li><a href="#privacy" className={`hover:text-primary-400 transition-colors text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Privacy Policy</a></li>
              <li><a href="#safety" className={`hover:text-primary-400 transition-colors text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Safety Guidelines</a></li>
              <li><a href="#insurance" className={`hover:text-primary-400 transition-colors text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Insurance Coverage</a></li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary-400" />
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>+91 12345 67890</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary-400" />
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>10verma2002aman@gmail.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary-400 mt-1 flex-shrink-0" />
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  123 Business District,<br />
                  Mumbai, Maharashtra 400001<br />
                  India
                </span>
              </div>
            </div>
          </motion.div>
        </div>


      </div>
    </footer>
  );
};

export default Footer;
