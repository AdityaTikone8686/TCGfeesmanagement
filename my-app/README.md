# 🏏 Cricket Academy Management System

A comprehensive web application for managing a cricket academy with detailed user and admin sections, payment tracking, and subscription management.

## 🚀 Features

### **Student Features**
- **User Registration & Login**: Secure authentication system
- **Personal Dashboard**: View payment status, subscription details, and payment history
- **Payment Status Tracking**: Real-time payment information with due amounts
- **Subscription Management**: View active subscriptions and plan details
- **Payment History**: Complete payment transaction history
- **Search Payment Status**: Search payment status by email address

### **Admin Features**
- **Comprehensive Dashboard**: Overview with statistics and reports
- **Student Management**: Add, view, and manage all students
- **Payment Management**: Record and track all payments
- **Fee Plan Management**: Create and manage different fee plans
- **Subscription Management**: Create and manage student subscriptions
- **Reporting System**: Monthly reports with financial analytics
- **Real-time Analytics**: Track total students, payments, and revenue

## 🛠️ Technology Stack

- **Frontend**: React.js with Vite
- **UI Framework**: Tailwind CSS with custom components
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT tokens
- **State Management**: React Context API

## 📋 Backend API Integration

The application is fully integrated with the backend API providing:

### **Authentication APIs**
- User registration and login
- Admin authentication
- JWT token management

### **Student APIs**
- Get user payment status
- View payment history
- Search payment status by email

### **Admin APIs**
- Student management (CRUD operations)
- Payment management
- Fee plan management
- Subscription management
- Reporting and analytics

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Backend server running on `http://localhost:5001`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 👥 User Roles

### **Students**
- Register and login to access personal dashboard
- View payment status and subscription details
- Track payment history
- Search payment status by email

### **Admins**
- Access comprehensive admin dashboard
- Manage all students and their information
- Record and track payments
- Create and manage fee plans
- Manage subscriptions
- View detailed reports and analytics

## 📊 Dashboard Features

### **Student Dashboard**
- Personal information display
- Payment status with due amounts
- Subscription details and plan information
- Payment history table
- Search functionality for payment status

### **Admin Dashboard**
- **Overview Tab**: Statistics and monthly reports
- **Students Tab**: Add new students and view all students
- **Payments Tab**: Record payments and view payment history
- **Fee Plans Tab**: Create and manage fee plans
- **Subscriptions Tab**: Manage student subscriptions
- **Reports Tab**: Detailed financial analytics

## 🔐 Authentication

### **Demo Credentials**

#### Student Login
- **Email**: student@example.com
- **Password**: password123

#### Admin Login
- **Email**: admin@example.com
- **Password**: admin123

## 📱 Pages & Routes

- `/` - Landing page
- `/student/register` - Student registration
- `/student/login` - Student login
- `/student/dashboard` - Student dashboard
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard

## 🎨 UI Components

The application uses a custom UI component library built with Tailwind CSS:

- **Cards**: For displaying information in organized sections
- **Buttons**: Various button styles and states
- **Inputs**: Form inputs with validation
- **Badges**: Status indicators and labels
- **Tables**: Data display with sorting and filtering

## 🔧 API Endpoints

### **Base URL**: `http://localhost:5001/api`

#### **Authentication**
- `POST /user/register` - Student registration
- `POST /user/login` - Student login
- `POST /admin/login` - Admin login
- `GET /user/status` - Get user payment status

#### **Admin Management**
- `GET /admin/students` - Get all students
- `POST /admin/students` - Add new student
- `GET /admin/payments` - Get all payments
- `GET /admin/feeplans` - Get all fee plans

#### **Payments**
- `POST /payments` - Add new payment
- `GET /payments/by-email/:email` - Get payments by email
- `PUT /payments/:id` - Update payment
- `DELETE /payments/:id` - Delete payment

#### **Fee Plans**
- `POST /feeplans` - Create fee plan
- `GET /feeplans` - Get all fee plans
- `PUT /feeplans/:id` - Update fee plan
- `DELETE /feeplans/:id` - Delete fee plan

#### **Subscriptions**
- `POST /subscriptions` - Create subscription
- `GET /subscriptions` - Get all subscriptions
- `PUT /subscriptions/:id` - Update subscription
- `DELETE /subscriptions/:id` - Delete subscription

#### **Reports**
- `GET /reports/summary` - Get monthly report summary

## 🎯 Key Features

### **Real-time Data**
- Live payment status updates
- Real-time subscription tracking
- Instant dashboard statistics

### **Responsive Design**
- Mobile-friendly interface
- Tablet and desktop optimized
- Consistent UI across devices

### **Security**
- JWT token authentication
- Protected routes
- Secure API communication

### **User Experience**
- Intuitive navigation
- Clear error messages
- Loading states and feedback
- Form validation

## 📈 Reporting & Analytics

### **Monthly Reports**
- Total students count
- Total payments collected
- Outstanding dues
- Average collection per student
- Popular fee plans
- Financial summaries

### **Dashboard Analytics**
- Real-time statistics
- Payment trends
- Student growth metrics
- Revenue tracking

## 🔄 State Management

The application uses React Context API for state management:

- **AuthContext**: Handles authentication state
- **User Status**: Manages user payment and subscription data
- **Loading States**: Provides feedback during API calls
- **Error Handling**: Centralized error management

## 🚀 Deployment

### **Development**
```bash
npm run dev
```

### **Production Build**
```bash
npm run build
```

### **Preview Production Build**
```bash
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the API endpoints
- Contact the development team

---

**Built with ❤️ for Cricket Academy Management**
