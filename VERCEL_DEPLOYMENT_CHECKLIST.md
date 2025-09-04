# Vercel Deployment Checklist

## ✅ Pre-Deployment Setup

### 1. MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account
- [ ] Create a new cluster
- [ ] Create database user with read/write permissions
- [ ] Whitelist all IP addresses (0.0.0.0/0) for Vercel
- [ ] Get connection string (mongodb+srv://...)

### 2. Environment Variables
Set these in your Vercel dashboard under Settings > Environment Variables:

- [ ] `MONGODB_URI` = `mongodb+srv://username:password@cluster.mongodb.net/travellite?retryWrites=true&w=majority`
- [ ] `JWT_SECRET` = `your-super-secret-jwt-key-here` (generate a secure random string)

### 3. Frontend Environment Variables
After deployment, update your frontend environment variables:
- [ ] `VITE_API_URL` = `https://your-actual-app-name.vercel.app/api`

## 🚀 Deployment Steps

### 1. Push to GitHub
- [ ] Commit all changes
- [ ] Push to GitHub repository

### 2. Deploy to Vercel
- [ ] Connect GitHub repository to Vercel
- [ ] Set environment variables in Vercel dashboard
- [ ] Deploy the application

### 3. Post-Deployment
- [ ] Update CORS origins in backend code with your actual Vercel domain
- [ ] Update frontend API URL with your actual Vercel domain
- [ ] Test all functionality

## 🔧 Configuration Files Created

- [x] `vercel.json` - Vercel deployment configuration
- [x] `package.json` - Root package.json with scripts
- [x] `.gitignore` - Git ignore file
- [x] `DEPLOYMENT.md` - Detailed deployment guide
- [x] Updated backend CORS configuration
- [x] Added health check endpoint

## 🧪 Testing After Deployment

### API Endpoints to Test
- [ ] `GET /api/health` - Health check
- [ ] `GET /api/stations/popular` - Popular stations
- [ ] `POST /api/auth/register` - User registration
- [ ] `POST /api/auth/login` - User login
- [ ] `GET /api/checklist/categories` - Security checklist categories

### Frontend Functionality
- [ ] Station selection
- [ ] User registration/login
- [ ] Security checklist
- [ ] Contact information form
- [ ] Image upload
- [ ] Booking confirmation

## 🐛 Troubleshooting

### Common Issues
1. **CORS Errors**: Update `ALLOWED_ORIGINS` in backend with your Vercel domain
2. **MongoDB Connection**: Verify connection string and IP whitelist
3. **Environment Variables**: Ensure all required variables are set
4. **Build Errors**: Check Node.js version compatibility

### Debug Commands
```bash
# Test API health
curl https://your-app.vercel.app/api/health

# Test stations endpoint
curl https://your-app.vercel.app/api/stations/popular
```

## 📝 Important Notes

1. **Update CORS Origins**: After deployment, update the `ALLOWED_ORIGINS` array in `backend/mongodb-auth-server.js` with your actual Vercel domain.

2. **Environment Variables**: The frontend `VITE_API_URL` should be updated after deployment to point to your actual Vercel domain.

3. **MongoDB Atlas**: Make sure your cluster is accessible from Vercel by whitelisting all IP addresses.

4. **JWT Secret**: Use a strong, random JWT secret for production.

## 🎉 Success Criteria

- [ ] Application deploys successfully to Vercel
- [ ] All API endpoints respond correctly
- [ ] Frontend loads and functions properly
- [ ] Database connections work
- [ ] User registration/login works
- [ ] Complete booking flow works end-to-end
