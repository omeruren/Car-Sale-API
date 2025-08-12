import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api';
import type { LoginRequest, RegisterRequest, User } from '@/types';

export function useAuth() {
  const queryClient = useQueryClient();

  // Get current user
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      try {
        const response = await authApi.getProfile();
        return response.data;
      } catch (error) {
        localStorage.removeItem('token');
        return null;
      }
    },
    retry: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        queryClient.setQueryData(['auth', 'user'], response.data.user);
        queryClient.invalidateQueries({ queryKey: ['auth'] });
      }
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        queryClient.setQueryData(['auth', 'user'], response.data.user);
        queryClient.invalidateQueries({ queryKey: ['auth'] });
      }
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      localStorage.removeItem('token');
      queryClient.setQueryData(['auth', 'user'], null);
      queryClient.clear();
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      localStorage.removeItem('token');
      queryClient.setQueryData(['auth', 'user'], null);
      queryClient.clear();
    },
  });

  const isAuthenticated = !!user;
  const isLoading = isLoadingUser || loginMutation.isPending || registerMutation.isPending;

  return {
    user,
    isAuthenticated,
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
  };
}