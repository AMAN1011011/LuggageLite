# TravelLite - Luggage Transportation Service 🧳✈️

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/travellite/luggage-system)
[![Test Coverage](https://img.shields.io/badge/coverage-85%25-green)](https://github.com/travellite/luggage-system)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

TravelLite is a comprehensive luggage transportation service for India that allows travelers to send their luggage ahead and travel light. Built with modern web technologies including React, Node.js, and MongoDB.

## 🌟 Features

### For Travelers
- **Easy Booking**: Book luggage transportation with a simple 5-step process
- **Station Network**: Coverage across 500+ railway stations and airports in India
- **Real-time Tracking**: Track your luggage throughout the journey
- **Secure Transport**: Comprehensive insurance and security measures
- **Multiple Payment Options**: Support for various payment methods
- **SMS/Email Notifications**: Stay updated on your booking status

### For Staff
- **Counter Interface**: Professional dashboard for station staff
- **Booking Management**: Lookup and manage customer bookings
- **Luggage Acceptance**: Streamlined workflow for accepting luggage
- **Statistics Dashboard**: Real-time stats and performance metrics

### Technical Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: User-preferred theme support
- **Progressive Web App**: App-like experience on mobile devices
- **Offline Support**: Basic functionality works offline
- **Accessibility**: WCAG 2.1 AA compliant
- **Modern Animations**: Smooth, delightful user interactions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+
- MongoDB 6.0+
- Redis 7+ (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/travellite/luggage-system.git
   cd luggage-system
   ```

2. **Run the setup script**
   ```bash
   ./scripts/setup.sh
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api/docs

## 📁 Project Structure

```
travellite-luggage-service/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context providers
│   │   ├── services/       # API service functions
│   │   ├── utils/          # Utility functions and helpers
│   │   └── assets/         # Static assets
│   ├── public/             # Public static files
│   └── tests/              # Frontend tests
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic services
│   │   └── utils/          # Backend utilities
│   ├── config/             # Configuration files
│   └── tests/              # Backend tests
├── scripts/                # Deployment and utility scripts
├── cypress/                # End-to-end tests
├── monitoring/             # Monitoring and logging configs
├── nginx/                  # Nginx configuration
└── docs/                   # Project documentation
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Hook Form** - Performant form handling
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing

### DevOps & Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and load balancer
- **Redis** - Caching and session storage
- **GitHub Actions** - CI/CD pipeline

### Testing
- **Jest** - Unit and integration testing
- **React Testing Library** - React component testing
- **Cypress** - End-to-end testing
- **Supertest** - API testing

### Monitoring
- **Prometheus** - Metrics collection
- **Grafana** - Metrics visualization
- **ELK Stack** - Logging and log analysis
- **Sentry** - Error tracking

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Backend Tests
```bash
npm run test:backend
```

### Frontend Tests
```bash
npm run test:frontend
```

### End-to-End Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:coverage
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Automated Deployment
```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

## 📊 Monitoring

### Application Metrics
- **Grafana Dashboard**: http://localhost:3000
- **Prometheus**: http://localhost:9090
- **Application Logs**: `docker-compose logs -f app`

### Health Checks
- **API Health**: http://localhost:5000/api/health
- **Database Status**: Included in health endpoint
- **Redis Status**: Included in health endpoint

## 🔧 Configuration

### Environment Variables
Copy `env.example` to `.env.development`, `.env.staging`, or `.env.production` and configure:

```bash
# Required
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/travellite
JWT_SECRET=your-secret-key

# Optional (for full functionality)
SENDGRID_API_KEY=your-sendgrid-key
TWILIO_ACCOUNT_SID=your-twilio-sid
RAZORPAY_KEY_ID=your-razorpay-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
```

### Feature Flags
Enable/disable features using environment variables:
- `ENABLE_BOOKING_CANCELLATION=true`
- `ENABLE_REAL_TIME_TRACKING=true`
- `ENABLE_SMS_NOTIFICATIONS=true`
- `ENABLE_EMAIL_NOTIFICATIONS=true`

## 🔐 Security

### Authentication
- JWT-based authentication
- Secure password hashing with bcrypt
- Session management with Redis

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting

### Infrastructure Security
- HTTPS enforcement
- Security headers
- Environment variable encryption
- Regular dependency updates

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout

### Booking Endpoints
- `POST /api/booking` - Create new booking
- `GET /api/booking` - Get user bookings
- `GET /api/booking/:id` - Get specific booking
- `POST /api/booking/:id/payment` - Process payment
- `PATCH /api/booking/:id/cancel` - Cancel booking

### Station Endpoints
- `GET /api/stations/popular` - Get popular stations
- `GET /api/stations/search` - Search stations
- `GET /api/stations/distance/:id1/:id2` - Calculate distance

### Full API documentation available at `/api/docs` when running the server.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style
- ESLint for JavaScript linting
- Prettier for code formatting
- Conventional commits for commit messages
- Pre-commit hooks ensure code quality

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Railway and Airport APIs for station data
- Payment gateway providers for secure transactions
- Open source community for amazing tools and libraries
- Beta testers and early adopters for valuable feedback

## 📞 Support

- **Documentation**: [docs.travellite.com](https://docs.travellite.com)
- **Issues**: [GitHub Issues](https://github.com/travellite/luggage-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/travellite/luggage-system/discussions)
- **Email**: support@travellite.com

## 🗺️ Roadmap

### Phase 1: Core Features ✅
- [x] User authentication and profiles
- [x] Station search and selection
- [x] Pricing calculation
- [x] Security checklist
- [x] Contact information management
- [x] Image upload system
- [x] Booking confirmation
- [x] Counter interface for staff

### Phase 2: Enhanced Features ✅
- [x] Advanced UI/UX with animations
- [x] Comprehensive testing suite
- [x] Production deployment setup
- [x] Monitoring and logging

### Phase 3: Advanced Features (Planned)
- [ ] Real-time tracking with GPS
- [ ] Mobile app (React Native)
- [ ] Loyalty program
- [ ] Referral system
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] AI-powered route optimization

### Phase 4: Scale & Optimization (Planned)
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] Advanced caching strategies
- [ ] Performance optimization
- [ ] Machine learning for pricing
- [ ] Blockchain for transparency

---

**Made with ❤️ by the TravelLite Team**

*Empowering travelers to explore India without the weight of luggage.*