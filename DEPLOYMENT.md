# Deployment Guide for Vercel

## Bugs Fixed

1. **Import/Export Inconsistencies**: Fixed inconsistent named vs default exports in utility files
2. **Typo Fixes**: Changed `messege` to `message` throughout the codebase
3. **Missing Function**: Added `deleteOnCloudinary` function in cloudinary.js
4. **Video Model**: Updated video model to properly store videoFile and thumbnail with url and public_id
5. **Vercel Config**: Fixed entry point from `./index.js` to `src/index.js`
6. **Route Registration**: Added all route handlers to app.js
7. **Error Handling**: Added global error handling middleware

## Deploy to Vercel

### Prerequisites

1. A Vercel account at https://vercel.com
2. MongoDB Atlas database or connection string
3. Cloudinary account for media storage

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### Step 2: Configure Environment Variables

Before deploying, you need to set up environment variables in Vercel:

1. Go to your Vercel dashboard
2. Create a new project or select your existing one
3. Go to Settings > Environment Variables
4. Add the following variables:

```
PORT=8000
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

### Step 3: Deploy via Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Step 4: Deploy via Git (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to https://vercel.com/new
3. Import your repository
4. Vercel will auto-detect the configuration from vercel.json
5. Add environment variables in the deployment settings
6. Click Deploy

### Step 5: Verify Deployment

After deployment, test your API:

```bash
# Health check
curl https://your-domain.vercel.app/api/v1/healthcheck

# Should return: {"success":true,"data":{"message":"Everything is O.K"},"message":"Ok"}
```

## API Endpoints

- **Users**: `/api/v1/users/*`
- **Videos**: `/api/v1/videos/*`
- **Tweets**: `/api/v1/tweets/*`
- **Subscriptions**: `/api/v1/subscriptions/*`
- **Playlists**: `/api/v1/playlist/*`
- **Likes**: `/api/v1/likes/*`
- **Comments**: `/api/v1/comments/*`
- **Dashboard**: `/api/v1/dashboard/*`
- **Health Check**: `/api/v1/healthcheck`

## Important Notes

1. **File Uploads**: Vercel serverless functions have a 4.5MB payload limit. Large file uploads may require a different hosting solution.
2. **Execution Time**: Vercel has a 10-second execution limit for hobby plans.
3. **MongoDB Atlas**: Ensure your MongoDB Atlas allows connections from 0.0.0.0/0 or Vercel's IP ranges.
4. **CORS**: Update `CORS_ORIGIN` to your frontend domain in production.

## Troubleshooting

### Issue: Module not found errors
- Ensure all imports use consistent default/named exports
- Check file path case sensitivity

### Issue: Database connection errors
- Verify MONGODB_URI is correct
- Check MongoDB Atlas network access settings
- Ensure database user has proper permissions

### Issue: File upload errors
- Verify Cloudinary credentials
- Check file size limits
- Ensure temp directory has write permissions (Vercel uses /tmp)

## Local Development

```bash
# Install dependencies
npm install

# Create .env file with your credentials
cp .env.sample .env

# Start development server
npm run dev
```

## Production Considerations

1. Use a production MongoDB cluster
2. Set up proper CORS origins
3. Implement rate limiting
4. Add request logging
5. Set up monitoring and alerts
6. Consider using a CDN for static assets
7. Implement proper backup strategies for database and media files
