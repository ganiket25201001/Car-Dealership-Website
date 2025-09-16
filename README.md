# LeadFlow Pro - HSR Motors Lead Management System

A modern, intelligent lead management system built specifically for automotive dealerships.

## 🚀 Features

### Core Functionality
- **Lead Listing**: Advanced table view with filtering, sorting, and search
- **Lead Details**: Comprehensive lead profiles with interaction history
- **Lead Management**: Kanban-style workflow with drag-and-drop
- **Business Dashboard**: Real-time analytics and KPIs

### Intelligent Automation
- **AI-Powered Lead Scoring**: 100-point algorithm analyzing engagement, demographics, and behavior
- **Smart Assignment**: Automatic lead routing based on team capacity and expertise
- **Predictive Analytics**: Conversion probability and performance forecasting
- **Multi-Channel Integration**: Facebook, Google, Website, Twitter, and offline sources

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router 6
- **Charts**: Chart.js + React-Chartjs-2
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Quick Start

1. **Navigate to the project directory:**
   ```bash
   cd "d:\git\SM\HSR Motors\leadflow-pro"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   
   Or use the setup script (Windows):
   ```bash
   setup.bat
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📱 Application Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Button, Card, etc.)
│   └── Layout.tsx       # Main layout with navigation
├── pages/               # Main application screens
│   ├── LeadListing.tsx  # Screen 1: Lead table/list
│   ├── LeadDetails.tsx  # Screen 2: Individual lead details
│   ├── LeadManagement.tsx # Screen 3: Kanban workflow
│   └── Dashboard.tsx    # Screen 4: Analytics dashboard
├── services/            # Business logic and data services
│   └── mockData.ts      # Mock data and algorithms
├── types/               # TypeScript type definitions
│   └── index.ts         # Lead, TeamMember, KPI interfaces
└── App.tsx             # Main application component
```

## 🎯 Screen Descriptions

### Screen 1: Lead Listing
- **Purpose**: Primary lead browsing and management interface
- **Features**: Advanced filtering, sorting, search, bulk actions
- **Key Components**: Data table, status badges, star ratings, quick actions

### Screen 2: Lead Details
- **Purpose**: Comprehensive individual lead management
- **Features**: Contact info, vehicle preferences, interaction timeline, notes
- **Key Components**: Two-column layout, activity feed, task management

### Screen 3: Lead Management
- **Purpose**: Visual workflow management with Kanban board
- **Features**: Drag-and-drop status updates, team assignment, bulk operations
- **Key Components**: Five-column Kanban, team sidebar, quick filters

### Screen 4: Business Dashboard
- **Purpose**: Executive analytics and performance insights
- **Features**: KPI cards, trend charts, team rankings, AI insights
- **Key Components**: Interactive charts, progress indicators, comparison metrics

## 📊 Sample Data

The application includes comprehensive mock data:

- **5 Sample Leads** with full profiles and interaction history
- **4 Team Members** with different roles and performance metrics
- **KPI Data** with trends and targets
- **Lead Scoring Algorithm** with realistic calculations
- **Auto-Assignment Logic** based on workload and performance

## 🎨 Design System

### Color Palette
- **Primary Blue**: #2563EB (Trust, reliability)
- **Success Green**: #10B981 (Conversions, positive metrics)
- **Warning Orange**: #F59E0B (Follow-ups, attention needed)
- **Danger Red**: #EF4444 (Overdue, critical alerts)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headers**: Bold, 24-32px
- **Body Text**: Regular, 14-16px
- **Captions**: Medium, 12px

### Components
- **Cards**: Consistent white background with subtle shadows
- **Buttons**: Multiple variants (primary, secondary, ghost)
- **Status Badges**: Color-coded with consistent styling
- **Icons**: Lucide React icon set for uniformity

## 🚀 Future Enhancements

### Phase 1 Additions
- **Real Backend Integration**: Replace mock data with API calls
- **Authentication**: User login and role-based permissions
- **Real-time Updates**: WebSocket integration for live collaboration
- **Email Integration**: Direct email sending from the application

### Phase 2 Features
- **Mobile App**: React Native version for field sales
- **Advanced AI**: Machine learning model training with real data
- **Integration Hub**: CRM, marketing platform, and communication tool APIs
- **Custom Workflows**: User-configurable business process automation

## 🎯 Business Impact

### Expected ROI (Annual)
- **Time Savings**: 40% reduction in lead processing time
- **Conversion Improvement**: 25% increase in lead-to-sale conversion
- **Team Efficiency**: 30% more leads processed per team member
- **Response Time**: 60% faster initial lead response

### Success Metrics
- Lead response time: <2 hours (target vs 4-6 hours current)
- Conversion rate: 20% (target vs 15% current)
- Team productivity: 25% improvement
- Customer satisfaction: 95% satisfaction score

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Dependencies
```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.15.0",
  "chart.js": "^4.4.0",
  "react-chartjs-2": "^5.2.0",
  "@dnd-kit/core": "^6.0.8",
  "tailwindcss": "^3.3.3",
  "lucide-react": "^0.279.0",
  "date-fns": "^2.30.0"
}
```

## 📞 Support

For technical support or feature requests, please contact the HSR Motors IT team.

---

**LeadFlow Pro** - Transform Leads Into Sales, Seamlessly

Built with ❤️ for HSR Motors Sales Team