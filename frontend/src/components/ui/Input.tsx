import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="form-group">
        {label && (
          <label className="form-label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`form-input ${error ? 'error' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="form-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';