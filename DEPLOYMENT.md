# Vercel Deployment Guide

## Prerequisites

1. **MongoDB Atlas Account**: Set up a MongoDB Atlas cluster
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **GitHub Repository**: Push your code to GitHub

## Environment Variables

### Frontend (.env.local)
```bash
VITE_API_URL=https://your-app-name.vercel.app/api
```

### Backend (Vercel Environment Variables)
Set these in your Vercel dashboard:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travellite?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
```

## Deployment Steps

### 1. Prepare MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist all IP addresses (0.0.0.0/0) for Vercel
5. Get your connection string

### 2. Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set the following environment variables in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string for JWT signing
3. Deploy the application

### 3. Update Frontend API URL
After deployment, update the frontend environment variable:
```bash
VITE_API_URL=https://your-actual-app-name.vercel.app/api
```

## Project Structure
```
├── frontend/          # React frontend
├── backend/           # Node.js backend
├── vercel.json        # Vercel configuration
└── DEPLOYMENT.md      # This file
```

## API Endpoints
The backend will be available at:
- `https://your-app.vercel.app/api/*`

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure CORS is configured for your Vercel domain
2. **MongoDB Connection**: Verify your MongoDB Atlas connection string
3. **Environment Variables**: Ensure all required env vars are set in Vercel

### Local Development:
```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm run dev
```

## Production Checklist
- [ ] MongoDB Atlas cluster created
- [ ] Environment variables set in Vercel
- [ ] CORS configured for production domain
- [ ] Frontend API URL updated
- [ ] Test all functionality after deployment
