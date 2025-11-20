# Quick Deploy to Vercel

## Method 1: Deploy via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Fix bugs and prepare for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel**
   - Visit https://vercel.com/new
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect the configuration

3. **Add Environment Variables**
   In Vercel dashboard, add these variables:
   ```
   MONGODB_URI=your-mongodb-connection-string
   CORS_ORIGIN=*
   ACCESS_TOKEN_SECRET=your-secret-key-here
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your-refresh-secret-key-here
   REFRESH_TOKEN_EXPIRY=10d
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   NODE_ENV=production
   ```

4. **Click Deploy**

## Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Add Environment Variables** (if not added via dashboard)
   ```bash
   vercel env add MONGODB_URI
   vercel env add ACCESS_TOKEN_SECRET
   vercel env add REFRESH_TOKEN_SECRET
   vercel env add CLOUDINARY_CLOUD_NAME
   vercel env add CLOUDINARY_API_KEY
   vercel env add CLOUDINARY_API_SECRET
   ```

## Test Your Deployment

After deployment, test with:
```bash
curl https://your-app.vercel.app/api/v1/healthcheck
```

Expected response:
```json
{
  "success": true,
  "data": {
    "message": "Everything is O.K"
  },
  "message": "Ok"
}
```

## Important: MongoDB Atlas Setup

1. Go to MongoDB Atlas (https://cloud.mongodb.com)
2. Navigate to Network Access
3. Click "Add IP Address"
4. Select "Allow Access from Anywhere" (0.0.0.0/0)
5. Or add Vercel's IP ranges

## All Fixed Issues

✓ Import/export consistency across all files
✓ Fixed typos (messege → message)
✓ Added missing deleteOnCloudinary function
✓ Fixed video model schema
✓ Corrected Vercel configuration
✓ Registered all API routes
✓ Added global error handling
✓ Created environment template

## Your API Endpoints

- POST `/api/v1/users/register` - Register new user
- POST `/api/v1/users/login` - Login user
- POST `/api/v1/users/logout` - Logout user
- GET `/api/v1/videos` - Get all videos
- POST `/api/v1/videos` - Upload video
- GET `/api/v1/healthcheck` - Health check

See DEPLOYMENT.md for complete API documentation.
