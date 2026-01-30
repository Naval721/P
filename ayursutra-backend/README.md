# AyurSutra Backend - Panchakarma Management System

A complete Node.js backend API for managing Panchakarma therapy clinics, built with Express.js and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd ayursutra-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `config.env` to `.env`
   - Update the MongoDB URI with your actual connection string
   - Change the JWT_SECRET to a secure random string

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Start the production server:**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
ayursutra-backend/
├── .env                    # Environment variables (create from config.env)
├── .gitignore             # Git ignore file
├── package.json           # Dependencies and scripts
├── app.js                 # Main Express application
├── config.env             # Environment template
├── db/
│   └── connect.js         # MongoDB connection module
└── routes/
    ├── auth.js            # Authentication routes
    ├── patients.js        # Patient management routes
    └── therapy.js         # Therapy scheduling routes
```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Frontend Configuration
FRONTEND_URL=http://localhost:8081

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=AyurSutra <noreply@ayursutra.com>
```

## 📚 API Endpoints

### Authentication
- `POST /api/practitioner/register` - Register a new practitioner
- `POST /api/practitioner/login` - Login practitioner
- `GET /api/practitioner/profile` - Get practitioner profile (protected)

### Patient Management
- `GET /api/patients/:practitionerId` - Get all patients for a practitioner
- `GET /api/patients/single/:id` - Get a specific patient
- `POST /api/patients` - Create a new patient
- `PUT /api/patients/:id` - Update a patient
- `DELETE /api/patients/:id` - Delete a patient
- `GET /api/patients/search/:practitionerId` - Search patients

### Therapy Scheduling
- `POST /api/therapy` - Create a therapy schedule
- `GET /api/therapy/practitioner/:practitionerId` - Get schedules for practitioner
- `GET /api/therapy/patient/:patientId` - Get schedules for patient
- `GET /api/therapy/:id` - Get specific therapy schedule
- `PUT /api/therapy/:id` - Update therapy schedule
- `POST /api/therapy/feedback/:id` - Add feedback to therapy
- `DELETE /api/therapy/:id` - Delete therapy schedule
- `GET /api/therapy/stats/:practitionerId` - Get therapy statistics

### Email
- `POST /api/email/test` - Send test email
- `POST /api/email/welcome` - Send welcome email to practitioner
- `POST /api/email/appointment-reminder` - Send appointment reminder
- `POST /api/email/therapy-completion` - Send therapy completion notification
- `POST /api/email/password-reset` - Send password reset email

### Utility
- `GET /health` - Health check endpoint
- `GET /api` - API documentation and available endpoints

## 🗄️ Database Collections

### Practitioners
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  clinicName: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Patients
```javascript
{
  _id: ObjectId,
  practitionerId: String,
  name: String,
  email: String,
  phone: String,
  primaryDosha: String,
  healthNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Therapy Schedules
```javascript
{
  _id: ObjectId,
  patientId: String,
  practitionerId: String,
  therapyName: String,
  scheduledDate: Date,
  scheduledTime: String,
  status: String,
  precautions: Array,
  feedback: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- CORS protection
- Input validation
- Error handling
- Environment variable protection

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:5000/health
```

### Register a Practitioner
```bash
curl -X POST http://localhost:5000/api/practitioner/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Doe",
    "email": "john@example.com",
    "password": "password123",
    "clinicName": "Ayurveda Wellness Center"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/practitioner/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 🚀 Deployment

1. Set `NODE_ENV=production` in your environment variables
2. Use a strong JWT_SECRET
3. Configure proper CORS origins
4. Use a process manager like PM2
5. Set up SSL/HTTPS
6. Configure MongoDB Atlas IP whitelist

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support, email support@ayursutra.com or create an issue in the repository.
