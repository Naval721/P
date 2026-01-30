# MongoDB Setup Guide

## Backend Configuration

### Environment Variables
Create a `.env` file in the `backend/` directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
```

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and update the `MONGODB_URI` in your `.env` file

### Database Collections
The application will automatically create the following collections:
- `practitioners` - Stores practitioner/user data
- `patients` - Stores patient information
- `therapySchedules` - Stores therapy appointment schedules

## Frontend Configuration

### Environment Variables
Create a `.env` file in the root directory with:

```env
# Frontend Environment Variables
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/practitioner/register` - Register a new practitioner
- `POST /api/practitioner/login` - Login practitioner

### Patients
- `GET /api/patients/:practitionerId` - Get all patients for a practitioner
- `POST /api/patients` - Create a new patient
- `PUT /api/patients/:id` - Update a patient
- `DELETE /api/patients/:id` - Delete a patient

### Therapy Schedules
- `POST /api/therapy-schedule` - Create a therapy schedule
- `GET /api/therapy-schedule/practitioner/:practitionerId` - Get schedules for practitioner
- `GET /api/therapy-schedule/patient/:patientId` - Get schedules for patient
- `PUT /api/therapy-schedule/:id` - Update a schedule
- `POST /api/therapy-schedule/feedback/:id` - Add feedback to a schedule

## Security Notes

1. **Change the JWT_SECRET** in production to a strong, random string
2. **Use environment-specific MongoDB URIs** for different environments
3. **Implement proper CORS settings** for production
4. **Use HTTPS** in production
5. **Implement rate limiting** for API endpoints
6. **Add input validation** and sanitization
7. **Use proper error handling** to avoid exposing sensitive information

## Troubleshooting

### Common Issues

1. **Connection refused**: Check if MongoDB Atlas cluster is running and IP is whitelisted
2. **Authentication failed**: Verify database user credentials
3. **CORS errors**: Check FRONTEND_URL in backend .env file
4. **JWT errors**: Ensure JWT_SECRET is set and consistent

### Testing Connection
Visit `http://localhost:5000/health` to check if the backend is running properly.
