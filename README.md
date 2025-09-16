# 🚗 LeadFlow Pro - HSR Motors Lead Management System

<div align="center">

![LeadFlow Pro Logo](https://via.placeholder.com/150x150/2563EB/FFFFFF?text=LFP)

**Transform Leads Into Sales, Seamlessly**

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https:## 🛠️ Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```bash
Error: connect ECONNREFUSED ::1:27017
```
**Solution:**
- Ensure MongoDB is running: `net start MongoDB` (Windows)
- Check connection string in `.env` file
- Verify MongoDB is listening on port 27017

**2. JWT Secret Error**
```bash
Error: JWT_SECRET environment variable is required
```
**Solution:**
- Add `JWT_SECRET` to your `.env` file
- Use a long, random string for security

**3. Port Already in Use**
```bash
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Kill process using port: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
- Or change PORT in `.env` file

**4. CORS Errors**
```bash
Access to fetch at 'http://localhost:5000' has been blocked by CORS
```
**Solution:**
- Ensure both frontend (3002) and backend (5000) are running
- Check FRONTEND_URL in server `.env` file

### 🔍 Debug Mode

Enable debug logging in development:

```bash
# In server/.env
NODE_ENV=development
DEBUG=leadflow:*
```

### 📱 Mobile Development

For mobile testing, update CORS origins in `server/server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:3002',
  'http://your-mobile-ip:3002'  // Add your local IP
];
```

## 🔧 Advanced Configuration

### Environment Variables

**Server Environment (server/.env):**
```env
# Database
MONGO_URI=mongodb://localhost:27017/leadflow-pro
# or for Atlas: mongodb+srv://username:password@cluster.mongodb.net/leadflow-pro

# Authentication
JWT_SECRET=your-256-bit-secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Server
NODE_ENV=development
PORT=5000

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Client Environment (client/.env):**
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api/v1

# App Configuration
VITE_APP_NAME=LeadFlow Pro
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_DARK_MODE=true
```

### Production Deployment

**1. Build for Production:**
```bash
# Build frontend
cd client && npm run build

# Start backend in production mode
cd server && NODE_ENV=production npm start
```

**2. Environment Setup:**
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure proper CORS origins
- Set up MongoDB Atlas for cloud database
- Enable HTTPS in production

## 📊 Monitoring & Analytics

### Health Checks

- **Backend Health**: `GET http://localhost:5000/health`
- **API Info**: `GET http://localhost:5000/api/v1/info`
- **Database Status**: Check MongoDB logs

### Performance Monitoring

Monitor key metrics:
- API response times
- Database query performance
- Memory usage
- Error rates
- User session analytics

## � Support

### 🆘 Getting Help

- **📖 Documentation**: Check this README for detailed information
- **🐛 Issues**: Report bugs via [GitHub Issues](https://github.com/ganiket25201001/Car-Dealership-Website/issues)
- **💬 Discussions**: Join community discussions
- **📧 Email**: Contact HSR Motors IT team for enterprise support

### 🔗 Useful Links

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)com/)

[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/ganiket25201001/Car-Dealership-Website.svg?style=for-the-badge)](https://github.com/ganiket25201001/Car-Dealership-Website/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/ganiket25201001/Car-Dealership-Website.svg?style=for-the-badge)](https://github.com/ganiket25201001/Car-Dealership-Website/network)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

## 🌟 Overview

**LeadFlow Pro** is a modern, intelligent lead management system designed specifically for automotive dealerships. Built with React 18 and TypeScript, it provides a comprehensive solution for managing leads from acquisition to conversion with AI-powered insights and streamlined workflows.

### ✨ Key Highlights

- 🤖 **AI-Powered Lead Scoring** - 100-point algorithm for lead prioritization
- 📊 **Real-time Analytics** - Comprehensive dashboard with KPIs and trends
- 🎯 **Smart Lead Assignment** - Automatic routing based on team expertise
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🌙 **Dark Theme Support** - Complete dark/light theme implementation
- ⚡ **Lightning Fast** - Built with Vite for optimal performance

## 🚀 Features

### 🎯 Core Functionality
- **📋 Lead Listing** - Advanced table with filtering, sorting, and bulk actions
- **👤 Lead Details** - Comprehensive profiles with interaction history
- **🔄 Lead Management** - Kanban-style workflow with drag-and-drop
- **📈 Business Dashboard** - Real-time analytics and performance metrics

### 🧠 Intelligent Automation
- **🎯 AI Lead Scoring** - Analyzing engagement, demographics, and behavior
- **⚡ Smart Assignment** - Automatic routing based on capacity and expertise
- **🔮 Predictive Analytics** - Conversion probability forecasting
- **🔗 Multi-Channel Integration** - Facebook, Google, Website, Twitter support

### 🎨 User Experience
- **🌓 Dark/Light Theme** - Complete theme switching capability
- **📱 Fully Responsive** - Optimized for all screen sizes
- **⌨️ Keyboard Shortcuts** - Power-user friendly navigation
- **♿ Accessibility** - WCAG 2.1 compliant design

## 🛠 Tech Stack

<table>
<tr>
<td align="center" width="120">
<img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
<br><strong>React 18</strong>
</td>
<td align="center" width="120">
<img src="https://skillicons.dev/icons?i=typescript" width="48" height="48" alt="TypeScript" />
<br><strong>TypeScript</strong>
</td>
<td align="center" width="120">
<img src="https://skillicons.dev/icons?i=vite" width="48" height="48" alt="Vite" />
<br><strong>Vite</strong>
</td>
<td align="center" width="120">
<img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind CSS" />
<br><strong>Tailwind CSS</strong>
</td>
</tr>
<tr>
<td align="center" width="120">
<img src="https://skillicons.dev/icons?i=nodejs" width="48" height="48" alt="Node.js" />
<br><strong>Node.js</strong>
</td>
<td align="center" width="120">
<img src="https://skillicons.dev/icons?i=express" width="48" height="48" alt="Express.js" />
<br><strong>Express.js</strong>
</td>
<td align="center" width="120">
<img src="https://skillicons.dev/icons?i=mongodb" width="48" height="48" alt="MongoDB" />
<br><strong>MongoDB</strong>
</td>
<td align="center" width="120">
<img src="https://skillicons.dev/icons?i=js" width="48" height="48" alt="JWT" />
<br><strong>JWT Auth</strong>
</td>
</tr>
</table>

### 📦 Key Dependencies

**Frontend Dependencies:**
```json
{
  "react": "^18.2.0",
  "typescript": "^5.0.2",
  "vite": "^4.4.5",
  "tailwindcss": "^3.3.3",
  "react-router-dom": "^6.15.0",
  "chart.js": "^4.4.0",
  "react-chartjs-2": "^5.2.0",
  "@dnd-kit/core": "^6.0.8",
  "lucide-react": "^0.279.0",
  "date-fns": "^2.30.0"
}
```

**Backend Dependencies:**
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "express-validator": "^7.0.1",
  "cors": "^2.8.5",
  "helmet": "^7.0.0",
  "express-rate-limit": "^6.10.0",
  "morgan": "^1.10.0",
  "dotenv": "^16.3.1"
}
```

## 📸 Screenshots

<div align="center">

### 🏠 Dashboard
![Dashboard](https://via.placeholder.com/800x500/2563EB/FFFFFF?text=Dashboard+Screenshot)

### 📋 Lead Listing
![Lead Listing](https://via.placeholder.com/800x500/10B981/FFFFFF?text=Lead+Listing+Screenshot)

### 🎯 Lead Management (Kanban)
![Lead Management](https://via.placeholder.com/800x500/F59E0B/FFFFFF?text=Kanban+Board+Screenshot)

### 👤 Lead Details
![Lead Details](https://via.placeholder.com/800x500/8B5CF6/FFFFFF?text=Lead+Details+Screenshot)

</div>

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16.0 or higher)
- **npm** (v7.0 or higher) or **yarn** (v1.22 or higher)
- **MongoDB** (v6.0 or higher) - [Download MongoDB](https://www.mongodb.com/try/download/community)
- **Git** (for cloning the repository)

### 🚀 Quick Start

#### 1. Clone the repository:
```bash
git clone https://github.com/ganiket25201001/Car-Dealership-Website.git
cd Car-Dealership-Website/leadflow-pro
```

#### 2. MongoDB Setup

**Option A: Local MongoDB Installation**

1. **Download and install MongoDB Community Server:**
   - Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Choose your operating system and download
   - Follow the installation wizard

2. **Start MongoDB service:**
   ```bash
   # Windows (as Administrator)
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. **Verify MongoDB is running:**
   ```bash
   mongo --version
   # or
   mongosh --version
   ```

**Option B: MongoDB Atlas (Cloud)**

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `localhost` connection in step 4 with your Atlas connection string

#### 3. Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   # Create .env file in server directory
   copy .env.example .env  # Windows
   # or
   cp .env.example .env    # macOS/Linux
   ```

4. **Configure environment variables in `.env`:**
   ```env
   # Database Configuration
   MONGO_URI=mongodb://localhost:27017/leadflow-pro
   
   # JWT Configuration
   JWT_SECRET=your-super-secure-jwt-secret-key-make-it-very-long-and-random
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   
   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3002
   ```

5. **Initialize database with sample data:**
   ```bash
   node setup-mongodb.js
   ```
   
   This will create:
   - 5 sample team members with different roles
   - 8 realistic leads with various statuses
   - Performance metrics and analytics data
   - Default login credentials

6. **Start the backend server:**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

   The server will run on `http://localhost:5000`

#### 4. Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd ../client
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
   
   **Windows users** can also use the provided setup script:
   ```bash
   setup.bat
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3002`

### 🔑 Default Login Credentials

After running the MongoDB setup script, you can log in with these accounts:

| Role | Email | Password |
|------|--------|----------|
| **Admin** | admin@hsrmotors.com | Admin123! |
| **Sales Manager** | sarah.johnson@hsrmotors.com | Password123! |
| **Sales Representative** | mike.wilson@hsrmotors.com | Password123! |
| **Sales Representative** | emily.davis@hsrmotors.com | Password123! |
| **Sales Representative** | james.smith@hsrmotors.com | Password123! |

### 🏗️ Build for Production

#### Frontend Build:
```bash
cd client
npm run build
# or
yarn build
```

#### Backend Production:
```bash
cd server
NODE_ENV=production npm start
```

The optimized build will be available in the `client/dist/` directory.

### 🔧 Development Scripts

**Frontend Scripts (client/):**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |
| `npm run type-check` | Run TypeScript type checking |

**Backend Scripts (server/):**

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with auto-reload |
| `node setup-mongodb.js` | Initialize database with sample data |
| `node setup-mongodb.js --clear` | Clear all existing data |
| `node setup-mongodb.js --help` | Show setup script help |

### 🗄️ Database Management

**MongoDB Setup Commands:**

```bash
# Initialize database with sample data
node setup-mongodb.js

# Clear existing data only
node setup-mongodb.js --clear

# Force setup in production
node setup-mongodb.js --force

# Get help
node setup-mongodb.js --help
```

**Sample Data Includes:**
- 5 team members (Admin, Manager, Sales Reps)
- 8 realistic leads with various statuses
- Interaction history and performance metrics
- Complete analytics data

## 🔌 API Configuration

### Backend API Endpoints

**Base URL:** `http://localhost:5000/api/v1`

#### Authentication Endpoints:
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user profile
- `PUT /auth/me` - Update user profile
- `GET /auth/logout` - Logout user
- `PUT /auth/updatepassword` - Update password
- `POST /auth/forgotpassword` - Forgot password
- `PUT /auth/resetpassword/:token` - Reset password
- `GET /auth/check` - Check authentication status

#### Lead Management Endpoints:
- `GET /leads` - Get all leads (with pagination, filters, search)
- `POST /leads` - Create new lead
- `GET /leads/:id` - Get single lead
- `PUT /leads/:id` - Update lead
- `DELETE /leads/:id` - Delete lead (soft delete)
- `POST /leads/:id/interactions` - Add interaction to lead
- `PATCH /leads/:id/status` - Update lead status
- `GET /leads/status/:status` - Get leads by status (Kanban)
- `PATCH /leads/bulk` - Bulk update leads
- `GET /leads/analytics/summary` - Lead analytics

#### Team Management Endpoints:
- `GET /team` - Get all team members
- `POST /team` - Create team member (Admin/Manager only)
- `GET /team/:id` - Get single team member
- `PUT /team/:id` - Update team member
- `DELETE /team/:id` - Delete team member (Admin only)
- `PUT /team/:id/password` - Change password
- `PATCH /team/:id/status` - Update member status
- `GET /team/:id/performance` - Get performance data
- `GET /team/analytics/summary` - Team analytics

### Database Schema

**Lead Model:**
- Advanced lead scoring (100-point algorithm)
- Interaction tracking with outcomes
- Vehicle interest and preferences
- Status progression tracking
- Performance analytics

**TeamMember Model:**
- Role-based access control
- Performance metrics tracking
- Authentication with JWT
- Secure password management

**Features:**
- JWT Authentication with role-based access
- Advanced MongoDB queries with aggregation
- Real-time lead scoring and analytics
- Comprehensive error handling
- Input validation and sanitization

## 🎯 Usage

### 🚀 Getting Started

1. **Dashboard Overview**: Start with the main dashboard to get insights into your leads
2. **Lead Management**: Use the Kanban board to manage lead progression through stages
3. **Lead Details**: Click on any lead to view comprehensive information and interaction history
4. **Analytics**: Monitor performance metrics and KPIs from the dashboard

### 🎨 Theme Switching

The application supports both light and dark themes:
- Use the theme toggle in the top navigation bar
- Theme preference is automatically saved to localStorage
- All components are fully optimized for both themes

### � Lead Scoring

Our AI-powered lead scoring system evaluates leads based on:
- **Engagement Score** (0-40 points): Email opens, website visits, response rates
- **Demographic Score** (0-30 points): Age, location, income level compatibility
- **Behavioral Score** (0-30 points): Inquiry timing, vehicle preferences, urgency indicators

## 📁 Project Structure

```
leadflow-pro/
├── 📁 client/                  # React Frontend
│   ├── 📁 public/              # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/      # Reusable UI components
│   │   │   ├── 📁 ui/         # Base components (Button, Card, etc.)
│   │   │   └── Layout.tsx     # Main layout wrapper
│   │   ├── 📁 contexts/       # React Context providers
│   │   │   ├── ThemeContext.tsx # Theme management
│   │   │   └── UserContext.tsx  # User state management
│   │   ├── 📁 pages/          # Application screens
│   │   │   ├── Dashboard.tsx  # 📊 Analytics dashboard
│   │   │   ├── LeadListing.tsx # 📋 Lead table view
│   │   │   ├── LeadDetails.tsx # 👤 Individual lead view
│   │   │   ├── LeadManagement.tsx # 🎯 Kanban board
│   │   │   └── UserProfile.tsx # 👤 User settings
│   │   ├── 📁 services/       # API services
│   │   │   ├── apiClient.js   # HTTP client configuration
│   │   │   ├── authService.js # Authentication API
│   │   │   ├── leadService.js # Lead management API
│   │   │   └── teamService.js # Team management API
│   │   ├── 📁 types/          # TypeScript definitions
│   │   │   └── index.ts       # Interface definitions
│   │   ├── App.tsx            # Root component
│   │   ├── main.tsx           # Application entry point
│   │   └── index.css          # Global styles
│   ├── 📄 package.json        # Frontend dependencies
│   ├── 📄 tailwind.config.js  # Tailwind configuration
│   ├── 📄 tsconfig.json       # TypeScript configuration
│   └── 📄 vite.config.ts      # Vite build configuration
├── 📁 server/                 # Node.js Backend
│   ├── 📁 middleware/         # Express middleware
│   │   ├── authMiddleware.js  # JWT authentication
│   │   └── errorMiddleware.js # Error handling
│   ├── 📁 models/             # Mongoose models
│   │   ├── Lead.js           # Lead data model
│   │   ├── TeamMember.js     # Team member model
│   │   ├── User.js           # User model
│   │   └── index.js          # Model exports
│   ├── 📁 routes/             # API endpoints
│   │   ├── auth.js           # Authentication routes
│   │   ├── leads.js          # Lead management routes
│   │   ├── team.js           # Team management routes
│   │   └── index.js          # Route aggregation
│   ├── 📄 server.js           # Express server setup
│   ├── 📄 setup-mongodb.js    # Database initialization
│   ├── 📄 package.json        # Backend dependencies
│   └── 📄 .env.example        # Environment template
├── 📄 README.md               # Project documentation
├── 📄 LICENSE                 # MIT License
├── 📄 CONTRIBUTING.md         # Contribution guidelines
└── 📄 CHANGELOG.md            # Version history
```

## 🔗 API Reference

### Lead Management

```typescript
// Lead interface
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed';
  score: number;
  source: string;
  vehicleInterest: string;
  assignedTo: string;
  createdAt: Date;
  lastContact: Date;
}

// Available lead operations
const leadOperations = {
  getAllLeads: () => Lead[],
  getLeadById: (id: string) => Lead,
  updateLeadStatus: (id: string, status: string) => void,
  assignLead: (leadId: string, teamMemberId: string) => void,
  calculateLeadScore: (lead: Lead) => number
}
```

### Team Management

```typescript
// Team member interface
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Sales Executive' | 'Senior Sales' | 'Sales Manager';
  activeLeads: number;
  monthlyTarget: number;
  conversions: number;
  responseTime: number;
}
```

## 🎨 Design System

### 🎨 Color Palette

```css
:root {
  /* Primary Colors */
  --blue-600: #2563EB;    /* Trust, reliability */
  --blue-500: #3B82F6;    /* Interactive elements */
  
  /* Status Colors */
  --green-500: #10B981;   /* Success, conversions */
  --yellow-500: #F59E0B;  /* Warning, follow-ups */
  --red-500: #EF4444;     /* Danger, overdue */
  
  /* Neutral Colors */
  --gray-900: #111827;    /* Dark text */
  --gray-600: #4B5563;    /* Secondary text */
  --gray-200: #E5E7EB;    /* Borders */
  --white: #FFFFFF;       /* Background */
}
```

### 📝 Typography Scale

| Element | Font Size | Font Weight | Usage |
|---------|-----------|-------------|-------|
| H1 | 2rem (32px) | 700 | Page titles |
| H2 | 1.5rem (24px) | 600 | Section headers |
| H3 | 1.25rem (20px) | 600 | Card titles |
| Body | 1rem (16px) | 400 | Regular text |
| Caption | 0.875rem (14px) | 500 | Labels, metadata |

### 🧩 Component Guidelines

- **Cards**: White background, rounded corners, subtle shadow
- **Buttons**: Primary (blue), Secondary (gray), Success (green)
- **Status Badges**: Color-coded with consistent styling
- **Icons**: 20px Lucide React icons for consistency

## 📊 Sample Data

The application includes comprehensive mock data for demonstration:

### 👥 Sample Leads (5 leads)
- **Sarah Johnson**: High-value prospect interested in luxury SUV
- **Michael Chen**: First-time buyer looking for compact car  
- **Emily Rodriguez**: Returning customer seeking family vehicle
- **David Kim**: Business owner interested in commercial vehicle
- **Lisa Thompson**: Young professional wanting sporty coupe

### 👨‍💼 Team Members (4 members)
- **John Smith**: Senior Sales Executive (15 active leads)
- **Emma Wilson**: Sales Executive (12 active leads)
- **Mike Johnson**: Sales Manager (8 active leads)
- **Sarah Davis**: Senior Sales (10 active leads)

### 📈 KPI Metrics
- Monthly targets and achievements
- Conversion rates and trends
- Response time analytics
- Lead source performance

## 🚀 Deployment

### 🌐 Vercel (Recommended)

1. **Connect your GitHub repository** to Vercel
2. **Configure build settings:**
   ```
   Build Command: npm run build
   Output Directory: dist
   ```
3. **Deploy** - Automatic deployments on every push to main

### 🔧 Other Platforms

<details>
<summary><strong>Netlify</strong></summary>

1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to Netlify
3. Configure redirects in `public/_redirects`:
   ```
   /*    /index.html   200
   ```
</details>

<details>
<summary><strong>GitHub Pages</strong></summary>

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "deploy": "gh-pages -d dist"
   ```
3. Run: `npm run build && npm run deploy`
</details>

## � Future Enhancements

### 📅 Phase 1 (Q1 2026)
- [ ] **Backend Integration** - Replace mock data with REST API
- [ ] **Authentication** - User login and role-based permissions  
- [ ] **Real-time Updates** - WebSocket integration for live data
- [ ] **Email Integration** - Direct email sending capabilities

### 📅 Phase 2 (Q2 2026)
- [ ] **Mobile App** - React Native version for field sales
- [ ] **Advanced AI** - Machine learning model training
- [ ] **Integration Hub** - CRM and marketing platform APIs
- [ ] **Custom Workflows** - User-configurable processes

### 📅 Phase 3 (Q3 2026)
- [ ] **Voice Integration** - Call recording and transcription
- [ ] **Document Management** - Contract and proposal handling
- [ ] **Advanced Reporting** - Custom dashboard creation
- [ ] **Multi-dealership** - Support for multiple locations

## 📈 Performance Metrics

### 🎯 Expected Business Impact
- **⏱️ Time Savings**: 40% reduction in lead processing time
- **📈 Conversion Improvement**: 25% increase in lead-to-sale conversion
- **👥 Team Efficiency**: 30% more leads processed per team member
- **⚡ Response Time**: 60% faster initial lead response

### 📊 Success Metrics
| Metric | Current | Target | Improvement |
|--------|---------|---------|-------------|
| Lead Response Time | 4-6 hours | <2 hours | 60% faster |
| Conversion Rate | 15% | 20% | +5% increase |
| Team Productivity | Baseline | +25% | 25% improvement |
| Customer Satisfaction | 85% | 95% | +10% increase |

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🔧 Development Setup

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** and ensure tests pass
4. **Commit your changes:**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to the branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### 📝 Contribution Guidelines

- **Code Style**: Follow the existing TypeScript and React patterns
- **Commits**: Use conventional commit messages
- **Testing**: Ensure all features are properly tested
- **Documentation**: Update README.md for new features

### 🐛 Bug Reports

Found a bug? Please open an issue with:
- **Description** of the bug
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 HSR Motors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software")...
```

## � Support

### 🆘 Getting Help

- **📖 Documentation**: Check this README for detailed information
- **🐛 Issues**: Report bugs via [GitHub Issues](https://github.com/ganiket25201001/Car-Dealership-Website/issues)
- **💬 Discussions**: Join community discussions
- **📧 Email**: Contact HSR Motors IT team for enterprise support

### 🔗 Useful Links

- [Live Demo](https://your-demo-url.com) (Coming Soon)
- [API Documentation](https://docs.your-api.com) (Coming Soon)
- [Component Storybook](https://storybook.your-app.com) (Coming Soon)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

![HSR Motors](https://via.placeholder.com/200x50/2563EB/FFFFFF?text=HSR+Motors)

**LeadFlow Pro** - Built with ❤️ for HSR Motors Sales Team

*Transforming automotive sales through intelligent lead management*

</div>