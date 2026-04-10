# Mortgage Loan Prequalification System - Frontend

React-based frontend for mortgage loan prequalification system with Tailwind CSS.

## Project Structure

```
mortgage-loan-app/
├── src/
│   ├── components/          # Reusable React components
│   ├── pages/              # Page components
│   ├── services/           # API service layer
│   ├── styles/             # Global CSS
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── public/                 # Static assets
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
└── index.html              # HTML template
```

## Installation

```bash
# Navigate to frontend directory
cd mortgage-loan-app

# Install dependencies
npm install
```

## Development

```bash
# Start development server (runs on http://localhost:3000)
npm run dev
```

## Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Key Features

- Clean, modular component structure
- Responsive design (mobile-first)
- Form validation and error handling
- Loading states and user feedback
- Toast notifications for success/error messages
- Tailwind CSS for styling
- Axios for API communication
