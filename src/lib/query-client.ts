import { QueryClient } from '@tanstack/react-query';
import axios from 'axios'; // Import axios to check for network errors

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000, // 5 minutes (60s is too short for a POS, causes too many background refetches)
      refetchOnWindowFocus: false,
      // Fix: Smart retry logic
      retry: (failureCount, error) => {
        console.log('it is the failure count', failureCount);
        
        // If it's a Network Error (backend is down), DO NOT retry.
        if (axios.isAxiosError(error) && !error.response) {
          return false;
        }
        // For other errors (like 500 Server Error), retry only once.
        return failureCount < 1;
      },
    },
  },
});
