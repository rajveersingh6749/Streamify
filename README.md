# VideoTube 🎥

A modern, full-stack video sharing platform built with React and Node.js. VideoTube allows users to upload, share, and discover videos with features like comments, likes, subscriptions, and playlists.

![VideoTube](https://img.shields.io/badge/VideoTube-v1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)
![Node.js](https://img.shields.io/badge/Node.js-Latest-339933.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248.svg)

## ✨ Features

### 🎬 Video Management
- **Upload Videos**: Support for MP4, WebM, and OGV formats
- **Custom Thumbnails**: Upload custom thumbnails for videos
- **Video Player**: Custom HTML5 video player with controls
- **Video Processing**: Automatic duration extraction and metadata handling
- **Publish/Draft**: Toggle video visibility

### 👥 User System
- **Authentication**: Secure JWT-based authentication
- **User Profiles**: Customizable profiles with avatars and cover images
- **Channel Pages**: Dedicated channel pages for each user
- **Account Management**: Update profile, change password, manage settings

### 🎯 Social Features
- **Comments**: Threaded commenting system with likes
- **Video Likes**: Like and dislike videos
- **Subscriptions**: Subscribe to channels and get updates
- **Playlists**: Create and manage video playlists
- **Watch History**: Track viewed videos
- **Watch Later**: Save videos for later viewing

### 🔍 Discovery
- **Search**: Full-text search across videos
- **Categories**: Browse videos by categories
- **Trending**: Discover popular videos
- **Recommendations**: Personalized video suggestions
- **Filters**: Sort by upload date, view count, duration

### 📱 User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Toggle between light and dark themes
- **Infinite Scroll**: Seamless content loading
- **Real-time Updates**: Live comment updates and notifications
- **Progressive Web App**: Installable PWA support

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **React Hot Toast** - Elegant notifications
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Media storage and optimization
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Cloudinary account (for media storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/videotube.git
   cd videotube
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the backend directory:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/videotube
   CORS_ORIGIN=http://localhost:5173
   
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d
   
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

   Create `.env` file in the frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

5. **Start the development servers**
   
   Backend:
   ```bash
   cd backend
   npm run dev
   ```
   
   Frontend (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## 📁 Project Structure

```
videotube/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── utils/          # Utility functions
│   │   ├── db/             # Database connection
│   │   └── app.js          # Express app setup
│   ├── public/temp/        # Temporary file storage
│   └── package.json
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   ├── config/         # Configuration files
│   │   └── App.jsx         # Main app component
│   ├── public/             # Static assets
│   └── package.json
│
└── README.md
```

## 🔧 Configuration

### Backend Configuration
- **Database**: Configure MongoDB connection in `src/db/index.js`
- **Authentication**: JWT secrets in environment variables
- **File Upload**: Cloudinary configuration for media storage
- **CORS**: Configure allowed origins for cross-origin requests

### Frontend Configuration
- **API Base URL**: Set backend API URL in environment variables
- **Theme**: Customize colors and styling in `tailwind.config.js`
- **Routes**: Configure application routes in `src/App.jsx`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `POST /api/v1/users/refresh-token` - Refresh access token

### Video Endpoints
- `GET /api/v1/videos` - Get all videos (with filters)
- `GET /api/v1/videos/:id` - Get video by ID
- `POST /api/v1/videos` - Upload new video
- `PATCH /api/v1/videos/:id` - Update video
- `DELETE /api/v1/videos/:id` - Delete video

### User Endpoints
- `GET /api/v1/users/current-user` - Get current user
- `GET /api/v1/users/c/:username` - Get user profile
- `PATCH /api/v1/users/update-account` - Update account details
- `PATCH /api/v1/users/avatar` - Update avatar
- `PATCH /api/v1/users/cover-image` - Update cover image

### Social Endpoints
- `POST /api/v1/likes/toggle/v/:videoId` - Toggle video like
- `POST /api/v1/subscriptions/c/:channelId` - Toggle subscription
- `GET /api/v1/comments/:videoId` - Get video comments
- `POST /api/v1/comments/:videoId` - Add comment

## 🎨 Customization

### Theming
The application supports both light and dark themes. Customize colors in `frontend/tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Your primary color palette
  },
  dark: {
    // Your dark theme colors
  }
}
```

### Components
All components are modular and reusable. Key components include:
- `VideoCard` - Video thumbnail and metadata
- `VideoPlayer` - Custom video player
- `CommentSection` - Comments with threading
- `Header` - Navigation and search
- `Sidebar` - Navigation menu

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt for password security
- **Input Validation** - Comprehensive input validation
- **File Upload Security** - File type and size validation
- **CORS Protection** - Configured cross-origin policies
- **Rate Limiting** - API rate limiting (recommended for production)

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Configure environment variables for production
3. Deploy to platforms like Heroku, Railway, or DigitalOcean
4. Set up Cloudinary for media storage

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3
3. Configure environment variables for production API URL

### Docker Deployment (Optional)
Create Docker containers for both frontend and backend for consistent deployment across environments.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design for all new UI components

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **MongoDB** - For the flexible NoSQL database
- **Cloudinary** - For media storage and optimization
- **Heroicons** - For the beautiful icon set

## 📞 Support

If you have any questions or need help with setup, please:
- Open an issue on GitHub
- Check the documentation
- Join our community discussions

## 🗺️ Roadmap

### Upcoming Features
- [ ] Live streaming support
- [ ] Video analytics dashboard
- [ ] Advanced video editing tools
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Video transcription and subtitles
- [ ] Advanced search filters
- [ ] Community posts and stories
- [ ] Monetization features
- [ ] API rate limiting and caching

---

**Built with ❤️ by the VideoTube Team**

*Star ⭐ this repository if you found it helpful!*