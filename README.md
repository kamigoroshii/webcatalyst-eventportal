# EventEase - Modern Event Management Platform

EventEase is a comprehensive event management platform built with React, featuring a modern design with custom color palette, AI-powered assistance, and role-based access control.

## 🎨 Design Features

- **Custom Color Palette**: Olive Green (#6F714B) primary, Light Cream (#FDFBE8) background
- **Modern UI**: Clean, minimal design with smooth animations using Framer Motion
- **Responsive Design**: Seamless experience across mobile, tablet, and desktop
- **Dark Mode**: Toggle with user preference persistence
- **Google Fonts**: Poppins for crisp readability

## ✨ Key Features

### For All Users
- **Event Discovery**: Browse and search events with filtering by category
- **Event Details**: Comprehensive event information with countdown timers
- **Registration System**: Easy registration with QR code confirmation tickets
- **AI Assistant**: Powered by Google Gemini for intelligent event assistance
- **Smart Recommendations**: AI-powered event suggestions based on preferences

### For Organizers
- **Dashboard**: Complete event management interface
- **Event Creation**: Intuitive form-based event creation and editing
- **Registration Management**: View, filter, and export attendee data
- **AI Description Generator**: Generate compelling event descriptions using Google Gemini
- **Event Planning Advice**: Get AI-powered tips and strategies for successful events

## 🛠 Tech Stack

### Frontend
- **React 18** with React Router for navigation
- **Material-UI (MUI)** with custom theming and dark mode
- **Framer Motion** for smooth animations and transitions
- **React Hook Form** with validation
- **React CSV** for data export functionality
- **QRCode.react** for registration tickets

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication and authorization
- **Google Gemini AI** for intelligent assistance
- **Multer** for file uploads
- **Nodemailer** for email notifications

### AI Integration
- **Google Gemini Pro** for natural language processing
- **Smart Context Awareness** for personalized responses
- **Event-Specific Training** for domain expertise

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eventease
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Copy environment variables
   cp .env.example .env
   # Edit .env file with your MongoDB connection string
   
   # Setup database with sample data
   npm run setup
   
   # Start backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ..  # Go back to root directory
   npm install
   
   # Create .env file for frontend
   echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
   
   # Start frontend development server
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Test Accounts
After running the setup script, you can use these test accounts:
- **Admin**: admin@eventease.com / admin123
- **Organizer**: organizer@eventease.com / organizer123  
- **Participant**: user@eventease.com / user123

### Build for Production

```bash
# Frontend
npm run build

# Backend
cd backend
npm start
```

## 📱 Pages & Components

### Authentication
- **ChatGPT-style login/signup** with floating labels and smooth animations
- **Role-based access** (Participant vs Organizer)
- **Form validation** with error handling

### Homepage
- **Event grid layout** with search and category filters
- **Pagination** for large event lists
- **Responsive cards** with hover animations

### Event Details
- **Comprehensive event information** with countdown timer
- **Registration modal** with form validation
- **QR code generation** for confirmed registrations
- **Google Maps integration** (ready for implementation)

### AI Assistant
- **Chat interface** with typing indicators
- **Contextual responses** based on user queries
- **Suggested questions** for better user experience
- **Event-specific assistance**

### Organizer Dashboard
- **Sidebar navigation** with responsive design
- **Dashboard overview** with statistics and recent activity
- **Event management** (create, edit, delete)
- **Registration analytics** with export functionality
- **AI description generator** for compelling event descriptions

## 🎯 User Roles

### Participant
- Browse and search events
- Register for events
- View registration confirmations
- Use AI assistant for help

### Organizer
- All participant features
- Access to organizer dashboard
- Create and manage events
- View and export registrations
- Generate AI-powered event descriptions

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=your_api_endpoint
REACT_APP_AI_API_KEY=your_ai_api_key
```

### Theme Customization
Modify `src/theme/theme.js` to customize colors, typography, and component styles.

### Mock Data
The application currently uses mock data. Replace the mock data in components with actual API calls:
- `src/pages/HomePage.js` - Event listings
- `src/pages/EventDetailPage.js` - Event details
- `src/components/Dashboard/` - Dashboard data

## 🚀 Deployment

### Netlify
1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify

### Vercel
1. Connect your repository to Vercel
2. Vercel will automatically build and deploy

### Traditional Hosting
1. Build the project: `npm run build`
2. Upload the `build` folder contents to your web server

## 🔮 Future Enhancements

- **Backend Integration**: Connect to a real API
- **Payment Processing**: Integrate payment gateways for paid events
- **Email Notifications**: Automated email confirmations and reminders
- **Calendar Integration**: Add to calendar functionality
- **Social Sharing**: Share events on social media
- **Advanced Analytics**: Detailed event and registration analytics
- **Multi-language Support**: Internationalization
- **Push Notifications**: Real-time event updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Material-UI for the excellent component library
- Framer Motion for smooth animations
- React Hook Form for form handling
- The React community for continuous inspiration

---

**EventEase** - Making event management effortless and engaging! 🎉