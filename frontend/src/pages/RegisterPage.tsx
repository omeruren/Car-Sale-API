import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Car } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { register: registerUser, isAuthenticated, isRegisterPending, registerError } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data: RegisterForm) => {
    const { confirmPassword, ...registerData } = data;
    registerUser(registerData);
  };

  const getErrorMessage = (error: unknown) => {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      return axiosError.response?.data?.message || 'Registration failed. Please try again.';
    }
    return 'Registration failed. Please try again.';
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="flex justify-center mb-4">
            <Car className="text-blue-600" style={{ width: '3rem', height: '3rem' }} />
          </div>
          <h2>Create your account</h2>
          <p>
            Or{' '}
            <Link to="/login" className="auth-link">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Full Name"
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          {registerError && (
            <div className="alert alert-error">
              <p>{getErrorMessage(registerError)}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            loading={isRegisterPending}
            disabled={isRegisterPending}
          >
            Create Account
          </Button>

          <div className="center" style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="auth-link">Terms of Service</Link>{' '}
            and{' '}
            <Link to="/privacy" className="auth-link">Privacy Policy</Link>
          </div>
        </form>
      </div>
    </div>
  );
}