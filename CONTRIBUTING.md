# Contributing to LeadFlow Pro

Thank you for your interest in contributing to LeadFlow Pro! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, browser, Node version)

### 💡 Suggesting Features

Feature suggestions are welcome! Please:

- **Check existing feature requests** to avoid duplicates
- **Provide clear use cases** and benefits
- **Include mockups or wireframes** if applicable
- **Consider implementation complexity**

### 🔧 Development Process

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Follow coding standards** (see below)
5. **Test your changes**
6. **Commit with descriptive messages**
7. **Push to your fork**
8. **Create a Pull Request**

## 📝 Coding Standards

### TypeScript & React

- Use **TypeScript** for all new code
- Follow **React functional components** with hooks
- Use **interfaces** for type definitions
- Implement **proper error handling**
- Write **self-documenting code** with clear naming

### Code Style

```typescript
// ✅ Good
interface LeadData {
  id: string;
  name: string;
  email: string;
  score: number;
}

const calculateLeadScore = (lead: LeadData): number => {
  // Implementation
};

// ❌ Avoid
const calc = (l: any) => {
  // Implementation
};
```

### Component Guidelines

- **Single Responsibility**: One component, one purpose
- **Props Interface**: Define clear prop types
- **Default Props**: Provide sensible defaults
- **Error Boundaries**: Handle errors gracefully

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false 
}) => {
  // Component implementation
};
```

### CSS/Styling

- Use **Tailwind CSS** for styling
- Follow **mobile-first** responsive design
- Ensure **dark theme compatibility**
- Maintain **consistent spacing** (4px grid system)

## 🧪 Testing

### Running Tests

```bash
npm run test          # Run unit tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Writing Tests

- Write tests for **new features** and **bug fixes**
- Use **descriptive test names**
- Test **both happy path and edge cases**
- Maintain **high code coverage**

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 📦 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or properly documented)

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] All tests passing

## Screenshots (if applicable)
Add screenshots for UI changes

## Additional Notes
Any additional context or considerations
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing verification**
4. **Documentation review**
5. **Merge approval**

## 🎯 Development Setup

### Prerequisites

- **Node.js** v16+
- **npm** v7+ or **yarn** v1.22+
- **Git** for version control

### Local Development

1. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/Car-Dealership-Website.git
   cd Car-Dealership-Website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to `http://localhost:3002`

### Useful Commands

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues
npm run type-check  # TypeScript type checking
```

## 🏗️ Project Architecture

### Directory Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts
├── pages/          # Application screens
├── services/       # Business logic
├── types/          # TypeScript definitions
└── utils/          # Utility functions
```

### Key Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Chart.js** - Data visualization
- **DND Kit** - Drag and drop

## 📋 Issue Labels

| Label | Description |
|-------|-------------|
| `bug` | Something isn't working |
| `enhancement` | New feature or improvement |
| `documentation` | Documentation needs |
| `good first issue` | Good for newcomers |
| `help wanted` | Community help needed |
| `priority:high` | High priority issue |
| `priority:low` | Low priority issue |

## 🎉 Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **Special thanks** in project documentation

## 📞 Getting Help

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and ideas
- **Code Reviews** - Learning and improvement

## 📄 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful** and inclusive
- **Provide constructive feedback**
- **Focus on the code**, not the person
- **Help others learn** and grow

Thank you for contributing to LeadFlow Pro! 🚀