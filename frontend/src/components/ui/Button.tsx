import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    className = '', 
    children, 
    disabled,
    ...props 
  }, ref) => {
    const variantClass = variant === 'primary' ? 'btn-primary' : variant === 'outline' ? 'btn-outline' : 'btn';
    
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`btn ${variantClass} ${className}`}
        style={{
          opacity: disabled || loading ? 0.5 : 1,
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          ...(size === 'sm' ? { padding: '0.375rem 0.75rem', fontSize: '0.875rem' } : {}),
          ...(size === 'lg' ? { padding: '0.75rem 1.5rem', fontSize: '1rem' } : {}),
        }}
        {...props}
      >
        {loading && <div className="spinner" style={{ marginRight: '0.5rem' }} />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';