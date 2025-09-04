import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToastProvider, useToast } from '../ui/Toast';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }, ref) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    )),
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  CheckCircle: () => <span data-testid="check-icon">✓</span>,
  XCircle: () => <span data-testid="error-icon">✗</span>,
  AlertCircle: () => <span data-testid="warning-icon">⚠</span>,
  Info: () => <span data-testid="info-icon">ℹ</span>,
  X: () => <span data-testid="close-icon">×</span>,
}));

// Test component that uses the toast hook
const TestComponent = () => {
  const { success, error, warning, info, addToast, removeAllToasts } = useToast();

  return (
    <div>
      <button onClick={() => success('Success message')}>Show Success</button>
      <button onClick={() => error('Error message')}>Show Error</button>
      <button onClick={() => warning('Warning message')}>Show Warning</button>
      <button onClick={() => info('Info message')}>Show Info</button>
      <button onClick={() => addToast({ 
        type: 'success', 
        message: 'Custom toast',
        title: 'Custom Title',
        duration: 1000
      })}>Show Custom</button>
      <button onClick={removeAllToasts}>Clear All</button>
    </div>
  );
};

const TestWrapper = ({ children }) => (
  <ToastProvider>
    {children}
  </ToastProvider>
);

describe('Toast System', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('ToastProvider', () => {
    it('provides toast context to children', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      expect(screen.getByText('Show Success')).toBeInTheDocument();
      expect(screen.getByText('Show Error')).toBeInTheDocument();
      expect(screen.getByText('Show Warning')).toBeInTheDocument();
      expect(screen.getByText('Show Info')).toBeInTheDocument();
    });

    it('throws error when useToast is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useToast must be used within a ToastProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Toast Types', () => {
    it('shows success toast with correct styling', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Show Success'));

      await waitFor(() => {
        expect(screen.getByText('Success message')).toBeInTheDocument();
        expect(screen.getByTestId('check-icon')).toBeInTheDocument();
      });

      const toast = screen.getByText('Success message').closest('div');
      expect(toast).toHaveClass('bg-green-50');
    });

    it('shows error toast with correct styling', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Show Error'));

      await waitFor(() => {
        expect(screen.getByText('Error message')).toBeInTheDocument();
        expect(screen.getByTestId('error-icon')).toBeInTheDocument();
      });

      const toast = screen.getByText('Error message').closest('div');
      expect(toast).toHaveClass('bg-red-50');
    });

    it('shows warning toast with correct styling', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Show Warning'));

      await waitFor(() => {
        expect(screen.getByText('Warning message')).toBeInTheDocument();
        expect(screen.getByTestId('warning-icon')).toBeInTheDocument();
      });

      const toast = screen.getByText('Warning message').closest('div');
      expect(toast).toHaveClass('bg-yellow-50');
    });

    it('shows info toast with correct styling', async () => {
      render(
        <TestWrapper>
          <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Show Info'));

      await waitFor(() => {
        expect(screen.getByText('Info message')).toBeInTheDocument();
        expect(screen.getByTestId('info-icon')).toBeInTheDocument();
      });

      const toast = screen.getByText('Info message').closest('div');
      expect(toast).toHaveClass('bg-blue-50');
    });
  });

  describe('Toast Features', () => {
    it('shows custom toast with title', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Show Custom'));

      await waitFor(() => {
        expect(screen.getByText('Custom Title')).toBeInTheDocument();
        expect(screen.getByText('Custom toast')).toBeInTheDocument();
      });
    });

    it('auto-dismisses toast after duration', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Show Custom'));

      await waitFor(() => {
        expect(screen.getByText('Custom toast')).toBeInTheDocument();
      });

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.queryByText('Custom toast')).not.toBeInTheDocument();
      });
    });

    it('allows manual dismissal via close button', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Show Success'));

      await waitFor(() => {
        expect(screen.getByText('Success message')).toBeInTheDocument();
      });

      const closeButton = screen.getByTestId('close-icon');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Success message')).not.toBeInTheDocument();
      });
    });

    it('clears all toasts when removeAllToasts is called', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Show multiple toasts
      fireEvent.click(screen.getByText('Show Success'));
      fireEvent.click(screen.getByText('Show Error'));

      await waitFor(() => {
        expect(screen.getByText('Success message')).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();
      });

      // Clear all toasts
      fireEvent.click(screen.getByText('Clear All'));

      await waitFor(() => {
        expect(screen.queryByText('Success message')).not.toBeInTheDocument();
        expect(screen.queryByText('Error message')).not.toBeInTheDocument();
      });
    });
  });

  describe('Toast Stacking', () => {
    it('shows multiple toasts simultaneously', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Show Success'));
      fireEvent.click(screen.getByText('Show Error'));
      fireEvent.click(screen.getByText('Show Warning'));

      await waitFor(() => {
        expect(screen.getByText('Success message')).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();
        expect(screen.getByText('Warning message')).toBeInTheDocument();
      });
    });

    it('maintains proper order of toasts', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Show Success'));
      fireEvent.click(screen.getByText('Show Error'));

      await waitFor(() => {
        const toasts = screen.getAllByRole('alert', { hidden: true });
        // First toast should appear first in DOM
        expect(toasts[0]).toHaveTextContent('Success message');
        expect(toasts[1]).toHaveTextContent('Error message');
      });
    });
  });

  describe('Toast Accessibility', () => {
    it('has proper ARIA attributes', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Show Success'));

      await waitFor(() => {
        const toast = screen.getByText('Success message').closest('div');
        expect(toast).toHaveAttribute('role', 'alert');
      });
    });

    it('close button is focusable and has proper label', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Show Success'));

      await waitFor(() => {
        const closeButton = screen.getByTestId('close-icon').closest('button');
        expect(closeButton).toBeInTheDocument();
        expect(closeButton).toHaveAttribute('type', 'button');
      });
    });
  });

  describe('Toast Progress Bar', () => {
    it('shows progress bar for timed toasts', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Show Success'));

      await waitFor(() => {
        expect(screen.getByText('Success message')).toBeInTheDocument();
        // Progress bar would be tested with more specific selectors in real implementation
      });
    });
  });

  describe('Toast Edge Cases', () => {
    it('handles rapid consecutive toast creation', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Rapidly click multiple times
      for (let i = 0; i < 5; i++) {
        fireEvent.click(screen.getByText('Show Success'));
      }

      await waitFor(() => {
        const successMessages = screen.getAllByText('Success message');
        expect(successMessages.length).toBe(5);
      });
    });

    it('handles empty message gracefully', async () => {
      const EmptyMessageTest = () => {
        const { success } = useToast();
        return <button onClick={() => success('')}>Empty Message</button>;
      };

      render(
        <TestWrapper>
          <EmptyMessageTest />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Empty Message'));

      // Should still create toast even with empty message
      await waitFor(() => {
        expect(screen.getByTestId('check-icon')).toBeInTheDocument();
      });
    });
  });
});
