# Tikone Cricket Academy - Fee Management System

A comprehensive fee management system for Tikone Cricket Academy, Pimpri. This application provides separate portals for students and administrators to manage cricket academy fees, subscriptions, and payments.

## 🏏 Project Overview

This is a full-stack web application built with:
- **Frontend**: React.js with Vite, Tailwind CSS, and Radix UI components
- **Backend**: Node.js with Express.js and MongoDB
- **Authentication**: JWT-based authentication for both students and administrators
- **File Upload**: Cloudinary integration for payment screenshots
- **Database**: MongoDB with Mongoose ODM

## 🚀 Features

### For Students
- User registration and login
- View available fee plans and subscriptions
- Submit payment requests with screenshots
- Track payment status and history
- View personal dashboard with subscription details

### For Administrators
- Admin authentication and dashboard
- Manage student accounts (CRUD operations)
- Create and manage fee plans
- Process payment requests
- Generate reports and analytics
- View all payments and subscriptions

## 📁 Project Structure

```
TCGfeesmanagement/
├── Backend/                    # Node.js/Express backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/            # Route controllers
│   ├── middleware/             # Authentication & validation
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API routes
│   ├── uploads/                # File uploads
│   └── server.js              # Main server file
├── my-app/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/           # React context providers
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   └── App.jsx           # Main app component
│   └── package.json
└── package.json               # Root package.json
```

## 🛠️ Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TCGfeesmanagement
```

### 2. Install Dependencies

Install dependencies for both backend and frontend:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../my-app
npm install
```

### 3. Environment Configuration

#### Backend Environment Variables

Create a `.env` file in the `Backend` directory:

```bash
cd Backend
touch .env
```

Add the following environment variables to `Backend/.env`:

```env
# Server Configuration
PORT=5001

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/tikone_cricket_academy
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/tikone_cricket_academy

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (optional, for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The application will automatically create the database

#### Option B: MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update the `MONGO_URI` in your `.env` file

### 5. Seed Data (Optional)

To populate the database with initial data, run the seed scripts:

```bash
cd Backend

# Seed admin users
node seedAdmins.js

# Seed fee plans
node seedFeePlans.js

# Seed sample users
node seedUser.js
```

## 🚀 Running the Application

### Development Mode (Recommended)

Run both backend and frontend simultaneously:

```bash
# From the root directory
npm run dev
```

This will start:
- Backend server on `http://localhost:5001`
- Frontend development server on `http://localhost:5173`

### Running Separately

#### Backend Only
```bash
cd Backend
npm run dev
```

#### Frontend Only
```bash
cd my-app
npm run dev
```

### Production Build

```bash
# Build frontend
cd my-app
npm run build

# Start backend in production
cd ../Backend
npm start
```

## 📱 Application Access

Once the application is running:

1. **Landing Page**: `http://localhost:5173`
2. **Student Login**: `http://localhost:5173/student/login`
3. **Admin Login**: `http://localhost:5173/admin/login`

## 🔐 Default Credentials

After running the seed scripts, you can use these default credentials:

### Admin Account
- Email: `admin@tikone.com`
- Password: `admin123`

### Sample Student Account
- Email: `student@example.com`
- Password: `password123`

## 🗄️ Database Models

### Core Models
- **User**: Student accounts with authentication
- **Admin**: Administrator accounts
- **FeePlan**: Subscription plans with pricing
- **Payment**: Payment records and transactions
- **Subscription**: User subscription details
- **PaymentRequest**: Payment approval workflow

## 🔌 API Endpoints

### Authentication
- `POST /api/user/login` - Student login
- `POST /api/admin/login` - Admin login
- `GET /api/user/status` - Get user status
- `GET /api/admin/status` - Get admin status

### Admin Management
- `GET /api/admin/students` - Get all students
- `POST /api/admin/students` - Add new student
- `PUT /api/admin/students/:id` - Update student
- `DELETE /api/admin/students/:id` - Delete student

### Fee Plans
- `GET /api/feeplans` - Get all fee plans
- `POST /api/feeplans` - Create fee plan
- `PUT /api/feeplans/:id` - Update fee plan
- `DELETE /api/feeplans/:id` - Delete fee plan

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Add payment
- `GET /api/payments/by-user/:userId` - Get user payments

### Payment Requests
- `GET /api/payment-requests` - Get all requests
- `POST /api/payment-requests` - Submit request
- `PUT /api/payment-requests/:id` - Update request status

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration
- File upload security

## 🎨 Frontend Features

- Responsive design with Tailwind CSS
- Modern UI components with Radix UI
- Dark/Light theme support
- Loading states and error handling
- Form validation
- Real-time updates

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your connection string in `.env`
   - Verify network connectivity for Atlas

2. **Port Already in Use**
   - Change the port in `.env` file
   - Kill processes using the port

3. **Module Not Found Errors**
   - Run `npm install` in both directories
   - Clear node_modules and reinstall

4. **CORS Errors**
   - Check CORS configuration in backend
   - Verify frontend URL in backend CORS settings

### Development Tips

- Use the Postman collection in `Backend/cricket-academy-postman-collection.json` for API testing
- Check browser console for frontend errors
- Monitor backend logs for server issues
- Use MongoDB Compass for database visualization

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🤝 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Tikone Cricket Academy** - Empowering cricket enthusiasts in Pimpri with world-class training and modern fee management solutions. 