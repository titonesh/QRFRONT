# 🎨 Mortgage Loan App - Design System Documentation

## Color Palette

### Primary Colors
- **Primary Blue**: `#00AEEF` - Main brand color for buttons and key accents
- **Primary Dark**: `#007EA7` - Hover/pressed state for primary elements
- **Primary Light**: `#E0F7FF` - Background tint for primary actions

### Accent Colors
- **Accent Cyan**: `#00C2D1` - Secondary highlights and interactive elements
- **Accent Light**: `#E0F7FF` - Light background for accent areas

### Background & Surface
- **Background Dark**: `#0F172A` - Primary dark background (optional)
- **Surface**: `#FFFFFF` - Card and component backgrounds
- **Surface Alt**: `#F9FAFB` - Secondary surface background

### Semantic Colors
- **Success**: `#10B981` - Positive actions and confirmations
- **Success Light**: `#D1FAE5` - Success background highlights
- **Error**: `#EF4444` - Errors and destructive actions
- **Error Light**: `#FEE2E2` - Error background highlights
- **Warning**: `#F59E0B` - Warnings and cautions
- **Warning Light**: `#FEF3C7` - Warning background highlights

### Neutral Grays
- `#F9FAFB` (50) - Lightest
- `#E5E7EB` (200) - Borders
- `#6B7280` (500) - Secondary text
- `#374151` (700) - Dark text
- `#111827` (900) - Darkest/primary text

---

## Typography

### Font Stack
- **Heading Font**: 'Goliath Century', 'Segoe UI', 'Roboto', sans-serif
- **Body Font**: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif

### Heading Sizes
- **h1**: 36px / font-weight: 600
- **h2**: 30px / font-weight: 600
- **h3**: 24px / font-weight: 600
- **h4**: 20px / font-weight: 600

### Body Text
- **Large**: 18px / font-weight: 400
- **Base**: 16px / font-weight: 400
- **Small**: 14px / font-weight: 400
- **XSmall**: 12px / font-weight: 400

### Font Weights
- Light: 300
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

---

## Components

### Button Component
**File**: `Button.jsx`

```jsx
import { Button } from './components';

// Primary Button
<Button variant="primary" size="md">Click me</Button>

// Secondary Button
<Button variant="secondary" size="lg">Secondary</Button>

// Danger Button
<Button variant="danger">Delete</Button>

// Loading State
<Button loading>Loading...</Button>

// Disabled State
<Button disabled>Disabled</Button>
```

**Props**:
- `variant`: 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `disabled`: boolean
- `onClick`: function

---

### Input Component
**File**: `Input.jsx`

```jsx
import { Input } from './components';

<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  value={value}
  onChange={handleChange}
  error={errors.email}
  helpText="We'll never share your email"
  required
/>
```

**Props**:
- `label`: string
- `type`: 'text' | 'email' | 'number' | 'tel' | 'password'
- `value`: string
- `onChange`: function
- `error`: string
- `helpText`: string
- `disabled`: boolean
- `required`: boolean

---

### Select Component
**File**: `Select.jsx`

```jsx
import { Select } from './components';

<Select
  label="Loan Tenor"
  options={[
    { value: '20', label: '20 years' },
    { value: '25', label: '25 years' },
  ]}
  value={value}
  onChange={handleChange}
  error={errors.tenor}
/>
```

**Props**:
- `label`: string
- `options`: Array<{ value, label }>
- `value`: string
- `onChange`: function
- `error`: string
- `placeholder`: string
- `disabled`: boolean
- `required`: boolean

---

### Card Component
**File**: `Card.jsx`

```jsx
import { Card } from './components';

// Default Card
<Card>
  <h3>Card Title</h3>
  <p>Card content here</p>
</Card>

// Elevated Card
<Card variant="elevated">Content</Card>

// Success Card
<Card variant="success">Success message</Card>

// Error Card
<Card variant="error">Error message</Card>

// Hoverable Card
<Card hoverable>Click me</Card>
```

**Props**:
- `variant`: 'default' | 'elevated' | 'outlined' | 'success' | 'error' | 'warning'
- `hoverable`: boolean

---

### ResultCard Component
**File**: `ResultCard.jsx`

```jsx
import { ResultCard } from './components';

<ResultCard
  title="Maximum Loan Amount"
  value="KES 500,000"
  subtitle="What you can borrow"
  highlight={true}
  icon="💰"
/>
```

**Props**:
- `title`: string
- `value`: string
- `subtitle`: string
- `highlight`: boolean
- `icon`: string (emoji)

---

### Modal Component
**File**: `Modal.jsx`

```jsx
import { Modal } from './components';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Request Callback"
  size="md"
>
  Modal content here
</Modal>
```

**Props**:
- `isOpen`: boolean
- `onClose`: function
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `children`: React elements

---

### Layout Component
**File**: `Layout.jsx`

```jsx
import { Layout } from './components';

// Centered Layout (for forms)
<Layout variant="centered">
  <Form />
</Layout>

// Default Layout
<Layout>
  <Content />
</Layout>
```

**Props**:
- `variant`: 'default' | 'centered' | 'fullWidth'
- `children`: React elements

---

## Page Components

### StyledLoanCalculatorForm
**File**: `StyledLoanCalculatorForm.jsx`

Fully styled loan calculator form with validation and error handling.

```jsx
import { StyledLoanCalculatorForm } from './components';

<StyledLoanCalculatorForm
  onSubmit={handleSubmit}
  loading={isLoading}
/>
```

---

### StyledLoanResultsDisplay
**File**: `StyledLoanResultsDisplay.jsx`

Results display with formatted currency, breakdown cards, and assumptions.

```jsx
import { StyledLoanResultsDisplay } from './components';

<StyledLoanResultsDisplay
  result={loanResult}
  onCalculateAgain={handleReset}
  onRequestCallback={openCallbackModal}
/>
```

---

### StyledCallbackRequestModal
**File**: `StyledCallbackRequestModal.jsx`

Modal form for callback requests with validation.

```jsx
import { StyledCallbackRequestModal } from './components';

<StyledCallbackRequestModal
  isOpen={isOpen}
  onClose={closeModal}
  onSubmit={handleSubmit}
  loading={isLoading}
  loanResultId={resultId}
/>
```

---

## Spacing Scale

- `0`: 0px
- `1`: 4px
- `2`: 8px
- `3`: 12px
- `4`: 16px
- `5`: 20px
- `6`: 24px
- `8`: 32px
- `10`: 40px
- `12`: 48px
- `16`: 64px
- `20`: 80px

---

## Border Radius

- `none`: 0px
- `sm`: 4px
- `base`: 6px
- `lg`: 8px
- `xl`: 12px
- `2xl`: 16px
- `3xl`: 20px
- `full`: 9999px

---

## Shadows

- `sm`: Light shadow
- `base`: Default shadow
- `md`: Medium shadow
- `lg`: Large shadow
- `xl`: Extra large shadow
- `focus`: Focus ring shadow (primary color)

---

## Animations

### Available Animations
- `fade-in`: Fade in with slide up (0.3s)
- `slide-up`: Slide up from bottom (0.3s)
- `spin`: Rotating spinner (1s)

### Transition Speeds
- `fast`: 150ms
- `base`: 200ms
- `slow`: 300ms

---

## CSS Classes

### Utility Classes
- `.container-custom`: Max-width container with auto margin
- `.text-truncate`: Overflow ellipsis
- `.transition-all`: Smooth transitions
- `.spinner`: Loading spinner
- `.spinner-sm`: Small spinner
- `.spinner-lg`: Large spinner

---

## Responsive Design

### Breakpoints
- **Mobile**: Default (< 768px)
- **Tablet**: `md:` (≥ 768px)
- **Desktop**: `lg:` (≥ 1024px)

### Example
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

---

## Accessibility

- All interactive elements have focus states
- Color contrast meets WCAG AA standards
- Semantic HTML structure
- ARIA labels for complex components
- Keyboard navigation support

---

## Best Practices

1. **Keep Components Simple**: Each component has a single responsibility
2. **Prop Drilling**: Pass data through props, not context
3. **Reusability**: Create small, composable components
4. **Consistency**: Use the design tokens consistently
5. **Performance**: Memoize expensive computations
6. **Testing**: Test component interactions and states

---

## Usage Example

```jsx
import { 
  Layout, 
  Card, 
  Button, 
  Input,
  StyledLoanCalculatorForm,
  StyledLoanResultsDisplay,
  StyledCallbackRequestModal 
} from './components';

export default function CalculatorPage() {
  const [result, setResult] = useState(null);
  const [showCallback, setShowCallback] = useState(false);

  return (
    <Layout variant="centered">
      {!result ? (
        <StyledLoanCalculatorForm onSubmit={setResult} />
      ) : (
        <StyledLoanResultsDisplay
          result={result}
          onCalculateAgain={() => setResult(null)}
          onRequestCallback={() => setShowCallback(true)}
        />
      )}

      <StyledCallbackRequestModal
        isOpen={showCallback}
        onClose={() => setShowCallback(false)}
        onSubmit={handleCallbackSubmit}
        loanResultId={result?.LoanResultId}
      />
    </Layout>
  );
}
```

---

## Token Reference

All design tokens are defined in `tailwind.config.js` and can be used as Tailwind classes:

```jsx
// Colors as classes
<div className="bg-primary text-text-primary border border-border">

// Spacing as classes
<div className="p-6 mb-4 gap-3">

// Border radius as classes
<div className="rounded-lg">

// Shadows as classes
<div className="shadow-md">

// Animations as classes
<div className="animate-fadeIn">
```

---

## File Structure

```
src/
├── components/
│   ├── index.js                          # Component exports
│   ├── Button.jsx                        # Button component
│   ├── Input.jsx                         # Input field component
│   ├── Select.jsx                        # Select dropdown component
│   ├── Card.jsx                          # Card component
│   ├── Modal.jsx                         # Modal component
│   ├── Layout.jsx                        # Layout wrapper
│   ├── ResultCard.jsx                    # Results card
│   ├── StyledLoanCalculatorForm.jsx      # Styled form
│   ├── StyledLoanResultsDisplay.jsx      # Styled results
│   └── StyledCallbackRequestModal.jsx    # Styled modal
├── styles/
│   └── globals.css                       # Global styles
└── tailwind.config.js                    # Tailwind config
```

---

**Created**: March 22, 2026
**Design System Version**: 1.0.0
**Status**: Production Ready
