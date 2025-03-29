import { renderHook, act } from '@testing-library/react';
import { useAuth, AuthProvider } from '../use-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the API calls
jest.mock('../../lib/queryClient', () => ({
  getQueryFn: jest.fn(),
  apiRequest: jest.fn(),
  queryClient: {
    setQueryData: jest.fn(),
  },
}));

describe('useAuth Hook', () => {
  const queryClient = new QueryClient();
  
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
  
  test('should initialize with null user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBeTruthy();
    expect(result.current.error).toBeNull();
  });
  
  // Additional tests would include testing login, logout, and register mutations
  // You would need to mock the responses from the API
});