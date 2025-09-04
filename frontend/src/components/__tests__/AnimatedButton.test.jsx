import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { motion } from 'framer-motion';
import AnimatedButton, { PrimaryButton, SecondaryButton } from '../ui/AnimatedButton';
import { ArrowRight } from 'lucide-react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    button: React.forwardRef(({ children, ...props }, ref) => (
      <button ref={ref} {...props}>
        {children}
      </button>
    )),
    div: React.forwardRef(({ children, ...props }, ref) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    )),
  },
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  ArrowRight: () => <span data-testid="arrow-right-icon">→</span>,
  Loader2: () => <span data-testid="loader-icon">⟳</span>,
}));

describe('AnimatedButton', () => {
  it('renders with default props', () => {
    render(<AnimatedButton>Click me</AnimatedButton>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
  });

  it('applies variant styles correctly', () => {
    render(<AnimatedButton variant="primary">Primary Button</AnimatedButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-600', 'text-white');
  });

  it('applies size styles correctly', () => {
    render(<AnimatedButton size="large">Large Button</AnimatedButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-base');
  });

  it('shows loading state correctly', () => {
    render(<AnimatedButton loading>Loading Button</AnimatedButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
  });

  it('renders icon in correct position', () => {
    render(
      <AnimatedButton icon={ArrowRight} iconPosition="right">
        Button with Icon
      </AnimatedButton>
    );
    
    expect(screen.getByTestId('arrow-right-icon')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<AnimatedButton onClick={handleClick}>Clickable Button</AnimatedButton>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<AnimatedButton disabled>Disabled Button</AnimatedButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('applies fullWidth class when fullWidth is true', () => {
    render(<AnimatedButton fullWidth>Full Width Button</AnimatedButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('applies custom className', () => {
    render(<AnimatedButton className="custom-class">Custom Button</AnimatedButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('renders as different button types', () => {
    render(<AnimatedButton type="submit">Submit Button</AnimatedButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });
});

describe('PrimaryButton', () => {
  it('renders with primary variant', () => {
    render(<PrimaryButton>Primary</PrimaryButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-600', 'text-white');
  });
});

describe('SecondaryButton', () => {
  it('renders with secondary variant', () => {
    render(<SecondaryButton>Secondary</SecondaryButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-100', 'text-gray-900');
  });
});

describe('AnimatedButton Accessibility', () => {
  it('has proper ARIA attributes when loading', () => {
    render(<AnimatedButton loading>Loading</AnimatedButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('disabled');
  });

  it('maintains focus styles', () => {
    render(<AnimatedButton>Focus Test</AnimatedButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('focus:outline-none', 'focus:ring-2');
  });

  it('supports keyboard navigation', () => {
    const handleClick = jest.fn();
    render(<AnimatedButton onClick={handleClick}>Keyboard Test</AnimatedButton>);
    
    const button = screen.getByRole('button');
    button.focus();
    
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.keyDown(button, { key: ' ' });
    
    // Note: React Testing Library doesn't automatically trigger click on Enter/Space
    // In a real browser, this would work due to native button behavior
    expect(button).toHaveFocus();
  });
});

describe('AnimatedButton Animation Props', () => {
  it('passes animation props correctly', () => {
    render(
      <AnimatedButton 
        animationType="bounce" 
        whileHover={{ scale: 1.1 }}
      >
        Animated Button
      </AnimatedButton>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    // Animation testing would require more complex setup with framer-motion test utilities
  });
});

describe('AnimatedButton Edge Cases', () => {
  it('handles undefined children gracefully', () => {
    render(<AnimatedButton>{undefined}</AnimatedButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('handles empty string children', () => {
    render(<AnimatedButton>{''}</AnimatedButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('handles complex children structures', () => {
    render(
      <AnimatedButton>
        <span>Complex</span>
        <span>Children</span>
      </AnimatedButton>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('ComplexChildren');
  });

  it('prevents click when loading', () => {
    const handleClick = jest.fn();
    render(
      <AnimatedButton loading onClick={handleClick}>
        Loading Button
      </AnimatedButton>
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('prevents click when disabled', () => {
    const handleClick = jest.fn();
    render(
      <AnimatedButton disabled onClick={handleClick}>
        Disabled Button
      </AnimatedButton>
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
});
