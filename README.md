# AyurSutra - Panchakarma Management System

A comprehensive web application designed specifically for Ayurvedic Panchakarma clinics to streamline patient management, appointment scheduling, and treatment tracking.

## 🚀 Features

### Core Functionality
- **Patient Management**: Complete patient profiles with Ayurvedic Prakriti analysis
- **Appointment Scheduling**: Intelligent scheduling system with conflict prevention
- **Treatment Tracking**: Comprehensive treatment history and progress monitoring
- **Inventory Management**: Herbal medicine and equipment tracking
- **Billing System**: Automated invoicing and payment tracking
- **Analytics Dashboard**: Real-time insights and performance metrics

### Technical Features
- **Modern UI/UX**: Responsive design with Tailwind CSS and Radix UI
- **Authentication**: Secure JWT-based authentication system
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful backend with Express.js
- **Frontend**: React with TypeScript and Vite

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI for components
- React Router for navigation
- TanStack Query for data fetching

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Express middleware for security

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with your configuration
cp .env.example .env

# Start the server
npm start

# For development with auto-restart
npm run dev
```

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

#### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/ayursutra
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8081
```

## 🏗️ Project Structure

```
ayurvedic-flow-front-main/
├── src/
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── pages/              # Page components
│   └── assets/             # Static assets
├── backend/
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   └── server.js           # Main server file
├── public/                 # Public assets
└── package.json           # Frontend dependencies
```

## 🔐 Authentication

The application uses JWT-based authentication with the following endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

## 📊 API Endpoints

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create new patient
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/:id` - Get appointment by ID
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Treatments
- `GET /api/treatments/types` - Get treatment types
- `GET /api/treatments/categories` - Get treatment categories
- `GET /api/treatments/protocols` - Get treatment protocols

### Inventory
- `GET /api/inventory` - Get inventory items
- `POST /api/inventory` - Add inventory item
- `PUT /api/inventory/:id` - Update inventory item

## 🎨 UI Components

The application uses a custom design system built with:
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible components
- **Custom color palette** inspired by Ayurvedic themes
- **Responsive design** for all screen sizes

## 🚀 Deployment

### Frontend Deployment
```bash
# Build the application
npm run build

# Deploy to your preferred hosting service
# (Vercel, Netlify, AWS S3, etc.)
```

### Backend Deployment
```bash
# Set production environment variables
NODE_ENV=production

# Start the server
npm start

# Deploy to your preferred hosting service
# (Heroku, AWS, DigitalOcean, etc.)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Frontend Development**: React, TypeScript, Tailwind CSS
- **Backend Development**: Node.js, Express, MongoDB
- **UI/UX Design**: Modern, accessible, responsive design
- **Database Design**: MongoDB schemas for Ayurvedic practice

## 📞 Support

For support or questions, please contact the development team.

---

**AyurSutra** - Transforming Ayurvedic care through modern technology.