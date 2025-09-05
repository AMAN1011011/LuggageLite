# Render Deployment Guide for TravelLite Luggage System

## SSL/TLS Connection Issues Fixed

The MongoDB SSL connection errors you encountered have been resolved with the updated connection string parameters.

## Updated MongoDB Connection String

The backend/.env file now includes these SSL/TLS parameters:

```bash
MONGODB_URI=mongodb+srv://10verma2002aman_db_user:mWGbmGu2cBb9cQDr@cluster0.btxrwjr.mongodb.net/travellite?retryWrites=true&w=majority&ssl=true&authSource=admin&tlsAllowInvalidCertificates=false&tlsAllowInvalidHostnames=false&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000
```

### Key SSL/TLS Parameters Added:
- `ssl=true` - Enables SSL connection
- `authSource=admin` - Specifies authentication database
- `tlsAllowInvalidCertificates=false` - Ensures valid certificates
- `tlsAllowInvalidHostnames=false` - Ensures valid hostnames
- `serverSelectionTimeoutMS=5000` - 5-second server selection timeout
- `connectTimeoutMS=10000` - 10-second connection timeout

## Render Deployment Steps

### 1. Environment Variables in Render Dashboard

Set these environment variables in your Render service:

```bash
MONGODB_URI=mongodb+srv://10verma2002aman_db_user:mWGbmGu2cBb9cQDr@cluster0.btxrwjr.mongodb.net/travellite?retryWrites=true&w=majority&ssl=true&authSource=admin&tlsAllowInvalidCertificates=false&tlsAllowInvalidHostnames=false&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000

JWT_SECRET=34144872fecc102808461b95b340c370374933ea3d4e5637be54a64555a1b336e2964753591f7f5292d238ad2dbbbe66a0cc6dc4dd881e34b89c02b14ef56a10
```

### 2. Render Service Configuration

**Build Command:**
```bash
cd backend && npm install
```

**Start Command:**
```bash
cd backend && npm start
```

**Root Directory:**
```
backend
```

### 3. MongoDB Atlas Configuration

Ensure your MongoDB Atlas cluster has:
- ✅ Network Access: All IP addresses (0.0.0.0/0) whitelisted
- ✅ Database User: `10verma2002aman_db_user` with read/write permissions
- ✅ Database: `travellite` created
- ✅ SSL/TLS enabled

### 4. Alternative Connection String (if issues persist)

If you still encounter SSL issues, try this alternative:

```bash
MONGODB_URI=mongodb+srv://10verma2002aman_db_user:mWGbmGu2cBb9cQDr@cluster0.btxrwjr.mongodb.net/travellite?retryWrites=true&w=majority&ssl=true&authSource=admin&tls=true&tlsInsecure=false
```

## Troubleshooting SSL Errors

### Common SSL Error Solutions:

1. **TLS Version Issues:**
   - The updated connection string includes proper TLS parameters
   - `tlsAllowInvalidCertificates=false` ensures certificate validation

2. **Connection Timeout:**
   - `serverSelectionTimeoutMS=5000` provides 5-second timeout
   - `connectTimeoutMS=10000` provides 10-second connection timeout

3. **Authentication Issues:**
   - `authSource=admin` specifies the correct authentication database

### Testing Connection Locally

Test the connection locally first:

```bash
cd backend
node mongodb-auth-server.js
```

You should see:
```
✅ Connected to MongoDB successfully
✅ Database indexes created
🚀 MongoDB Authentication Server running on port 5000
```

## Frontend Environment Variables

Update your frontend environment variables to point to your Render backend:

```bash
VITE_API_URL=https://your-render-app-name.onrender.com/api
```

## Deployment Checklist

- [ ] MongoDB Atlas cluster configured with SSL
- [ ] Environment variables set in Render dashboard
- [ ] Build and start commands configured
- [ ] Network access whitelisted in MongoDB Atlas
- [ ] Frontend API URL updated to Render backend
- [ ] Test all endpoints after deployment

## API Endpoints to Test

After deployment, test these endpoints:

- `GET https://your-app.onrender.com/api/health`
- `GET https://your-app.onrender.com/api/stations/popular`
- `POST https://your-app.onrender.com/api/auth/register`

The SSL connection issues should now be resolved with the updated MongoDB connection string parameters.
