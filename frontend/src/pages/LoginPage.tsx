import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Car } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login, isAuthenticated, isLoginPending, loginError } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data: LoginForm) => {
    login(data);
  };

  const getErrorMessage = (error: unknown) => {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      return axiosError.response?.data?.message || 'Login failed. Please try again.';
    }
    return 'Login failed. Please try again.';
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="flex justify-center mb-4">
            <Car className="text-blue-600" style={{ width: '3rem', height: '3rem' }} />
          </div>
          <h2>Sign in to your account</h2>
          <p>
            Or{' '}
            <Link to="/register" className="auth-link">
              create a new account
            </Link>
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
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
            autoComplete="current-password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register('password')}
          />

          {loginError && (
            <div className="alert alert-error">
              <p>{getErrorMessage(loginError)}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            loading={isLoginPending}
            disabled={isLoginPending}
          >
            Sign in
          </Button>

          <div className="center">
            <Link to="/forgot-password" className="auth-link">
              Forgot your password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}