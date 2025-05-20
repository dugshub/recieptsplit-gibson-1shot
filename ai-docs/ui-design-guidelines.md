# SplitReceipt UI Design Guidelines

This document provides design principles, patterns, and guidelines for implementing the SplitReceipt application's user interface. Follow these guidelines to create a consistent, attractive, and user-friendly experience.

## Design Principles

1. **Clean and Minimal**
   - Focus on content and functionality
   - Avoid cluttered interfaces
   - Use whitespace strategically

2. **Responsive First**
   - Design for mobile and scale up
   - Use flexible layouts that adapt to different screens
   - Test breakpoints at 640px (sm), 768px (md), and 1024px (lg)

3. **Consistent Visual Language**
   - Maintain consistent styling throughout the app
   - Use the same components for similar actions
   - Follow established patterns for forms, lists, and cards

4. **Action-Oriented**
   - Make primary actions clearly visible
   - Use visual hierarchy to guide user attention
   - Provide clear feedback for user interactions

## Color Scheme

```
Primary: #2563eb (blue-600)
Secondary: #10b981 (emerald-500)
Background: #f8fafc (slate-50)
Card Background: #ffffff (white)
Text: #1e293b (slate-800)
Muted Text: #64748b (slate-500)
Border: #e2e8f0 (slate-200)
Error: #ef4444 (red-500)
```

## Typography

```
Heading 1: 2.25rem (text-4xl), font-bold, tracking-tight
Heading 2: 1.875rem (text-3xl), font-bold
Heading 3: 1.5rem (text-2xl), font-semibold
Body: 1rem (text-base), font-normal
Small: 0.875rem (text-sm), font-normal
```

## Component Patterns

### Landing Page

The landing page for non-authenticated users should:
- Feature a hero section with app name and tagline
- Include call-to-action buttons (Login/Register)
- Display feature highlights in a card grid
- Use animation subtly to draw attention

```jsx
// Example pattern for hero section
<div className="container mx-auto min-h-screen flex flex-col justify-center items-center">
  <div className="text-center space-y-6 max-w-2xl mx-auto">
    <h1 className="text-4xl font-bold tracking-tight">SplitReceipt</h1>
    <p className="text-xl text-muted-foreground">
      Descriptive tagline here
    </p>
    
    {/* Call-to-action buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
      {/* Use Button components */}
    </div>
    
    {/* Feature cards grid */}
    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Use Card components */}
    </div>
  </div>
</div>
```

### Dashboard (Authenticated Home)

The dashboard for authenticated users should:
- Feature a welcome message with user's name
- Show recent activity or trips
- Include quick actions for common tasks
- Display summary statistics if available

### Navigation

- Use a persistent navigation bar
- Include user profile/avatar with dropdown menu
- Make the current section visually distinct
- Provide clear back navigation where needed

### Trip Cards

Trip cards should:
- Display trip name prominently
- Show date range in secondary styling
- Include visual representation of trip members (avatars)
- Display total amount in a distinct badge
- Use hover effects for interactive feedback

```jsx
// Example pattern for trip card
<Card className="cursor-pointer hover:shadow-md transition-shadow">
  <CardHeader className="pb-2">
    <CardTitle>{tripName}</CardTitle>
    <p className="text-sm text-muted-foreground">
      {format date range}
    </p>
  </CardHeader>
  <CardContent>
    <div className="flex justify-between items-center">
      {/* Member avatars with overflow indicator */}
      <div className="flex -space-x-2">
        {/* Member avatar components */}
      </div>
      
      {/* Trip amount badge */}
      <div className="bg-muted px-3 py-1 rounded-full text-sm font-medium">
        {format amount}
      </div>
    </div>
  </CardContent>
</Card>
```

### Tabs Interface

For multi-view pages (like trip details):
- Use tabs for switching between different views (Receipts, Members, Balances)
- Keep tab design simple and clear
- Use subtle animation for tab transitions
- Maintain consistent height to prevent layout shifts

### Receipt List & Details

- Display receipts in a card-based list
- Show key details (date, merchant, total)
- Provide clear navigation to receipt details
- Use expandable sections for line items
- Include visual indicators for receipt status

### Forms

- Group related fields logically
- Use consistent input styling
- Provide inline validation feedback
- Include clear submit and cancel actions
- Consider multi-step forms for complex inputs

## State Management Patterns

### Loading States

- Use minimal, centered spinners for page loading
- Consider skeleton loaders for content areas
- Display loading indicators only after a short delay (300-500ms)
- Keep branding consistent in loading states

```jsx
// Example loading pattern
{isLoading ? (
  <div className="flex justify-center py-12">
    <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full"></div>
  </div>
) : (
  // Content
)}
```

### Empty States

- Provide friendly, encouraging messages
- Include clear call-to-action
- Use illustrations or icons where appropriate
- Maintain consistent page structure

```jsx
// Example empty state pattern
{items.length === 0 ? (
  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
    <h3 className="text-lg font-medium mb-2">No items yet</h3>
    <p className="text-muted-foreground mb-6">Encouraging message here</p>
    <Button>Call to action</Button>
  </div>
) : (
  // Items list
)}
```

### Error States

- Display clear error messages
- Provide actionable resolution steps
- Use appropriate color coding (red for errors)
- Consider retry mechanisms where applicable

## Authentication Flow

- Keep login/register forms simple and focused
- Clearly indicate required fields
- Provide password strength indicators
- Include social login options if applicable
- Display clear feedback for authentication errors

## Responsive Considerations

- Stack elements vertically on mobile
- Use single columns for lists on small screens
- Consider collapsible navigation on mobile
- Ensure touch targets are at least 44px height/width
- Test interactions with touch and mouse input

## Animation Guidelines

- Use subtle transitions for state changes
- Consider reduced motion preferences
- Keep animations under 300ms for UI elements
- Use consistent easing functions

By following these design guidelines, you'll create a consistent and user-friendly experience throughout the SplitReceipt application. These patterns establish a strong foundation while still allowing for creative implementation.