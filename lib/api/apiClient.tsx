// Enhanced API client with loading states and error handling
import React from 'react';
import { toast } from 'react-hot-toast';

interface ApiResponse<T = any> {
  data?: T;
  success: boolean;
  error?: string;
  status: number;
}

interface ApiOptions {
  showLoading?: boolean;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
  loadingMessage?: string;
}

class ApiClient {
  private baseURL: string;
  private loadingStates: Map<string, boolean> = new Map();
  private loadingCallbacks: Map<string, ((loading: boolean) => void)[]> = new Map();

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  // Subscribe to loading state changes
  onLoadingChange(endpoint: string, callback: (loading: boolean) => void) {
    if (!this.loadingCallbacks.has(endpoint)) {
      this.loadingCallbacks.set(endpoint, []);
    }
    this.loadingCallbacks.get(endpoint)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.loadingCallbacks.get(endpoint);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // Set loading state and notify subscribers
  private setLoading(endpoint: string, loading: boolean) {
    this.loadingStates.set(endpoint, loading);
    const callbacks = this.loadingCallbacks.get(endpoint);
    if (callbacks) {
      callbacks.forEach(callback => callback(loading));
    }
  }

  // Get current loading state
  isLoading(endpoint: string): boolean {
    return this.loadingStates.get(endpoint) || false;
  }

  // Enhanced fetch with loading states
  private async enhancedFetch<T>(
    endpoint: string,
    options: RequestInit = {},
    apiOptions: ApiOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      showLoading = true,
      showErrorToast = true,
      showSuccessToast = false,
      successMessage,
      loadingMessage
    } = apiOptions;

    const url = `${this.baseURL}${endpoint}`;
    let toastId: string | undefined;

    try {
      // Set loading state
      if (showLoading) {
        this.setLoading(endpoint, true);
        if (loadingMessage) {
          toastId = toast.loading(loadingMessage);
        }
      }

      // Add default headers
      const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      // Add auth token if available
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers: defaultHeaders,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Handle success
      if (showSuccessToast && successMessage) {
        if (toastId) {
          toast.success(successMessage, { id: toastId });
        } else {
          toast.success(successMessage);
        }
      } else if (toastId) {
        toast.dismiss(toastId);
      }

      return {
        data,
        success: true,
        status: response.status,
      };

    } catch (error: any) {
      // Handle error
      if (showErrorToast) {
        const errorMessage = error.message || 'An unexpected error occurred';
        if (toastId) {
          toast.error(errorMessage, { id: toastId });
        } else {
          toast.error(errorMessage);
        }
      } else if (toastId) {
        toast.dismiss(toastId);
      }

      return {
        success: false,
        error: error.message,
        status: error.status || 500,
      };

    } finally {
      // Clear loading state
      if (showLoading) {
        this.setLoading(endpoint, false);
      }
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, options: ApiOptions = {}): Promise<ApiResponse<T>> {
    return this.enhancedFetch<T>(endpoint, { method: 'GET' }, options);
  }

  async post<T>(endpoint: string, data?: any, options: ApiOptions = {}): Promise<ApiResponse<T>> {
    return this.enhancedFetch<T>(
      endpoint,
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      },
      options
    );
  }

  async put<T>(endpoint: string, data?: any, options: ApiOptions = {}): Promise<ApiResponse<T>> {
    return this.enhancedFetch<T>(
      endpoint,
      {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      },
      options
    );
  }

  async delete<T>(endpoint: string, options: ApiOptions = {}): Promise<ApiResponse<T>> {
    return this.enhancedFetch<T>(endpoint, { method: 'DELETE' }, options);
  }

  // File upload with progress
  async uploadFile<T>(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({
            data,
            success: xhr.status >= 200 && xhr.status < 300,
            status: xhr.status,
          });
        } catch (error) {
          resolve({
            success: false,
            error: 'Invalid response format',
            status: xhr.status,
          });
        }
      });

      xhr.addEventListener('error', () => {
        resolve({
          success: false,
          error: 'Upload failed',
          status: xhr.status,
        });
      });

      // Add auth token
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.open('POST', `${this.baseURL}${endpoint}`);
      xhr.send(formData);
    });
  }

  // Batch requests with loading state
  async batch<T>(
    requests: Array<{
      endpoint: string;
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      data?: any;
    }>,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T[]>> {
    const batchId = 'batch-' + Date.now();
    
    try {
      this.setLoading(batchId, true);
      
      const promises = requests.map(req => 
        this.enhancedFetch(req.endpoint, {
          method: req.method || 'GET',
          body: req.data ? JSON.stringify(req.data) : undefined,
        }, { showLoading: false, showErrorToast: false })
      );

      const results = await Promise.all(promises);
      const hasErrors = results.some(result => !result.success);

      if (hasErrors && options.showErrorToast) {
        toast.error('Some requests failed');
      }

      return {
        data: results.map(r => r.data) as T[],
        success: !hasErrors,
        status: 200,
      };

    } finally {
      this.setLoading(batchId, false);
    }
  }
}

// Create singleton instance
export const apiClient = new ApiClient('/api');

// React hook for API loading states
export function useApiLoading(endpoint: string) {
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(apiClient.isLoading(endpoint));
    const unsubscribe = apiClient.onLoadingChange(endpoint, setLoading);
    return unsubscribe;
  }, [endpoint]);

  return loading;
}

// Higher-order component for API loading
export function withApiLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  endpoint: string
) {
  return function WithLoadingComponent(props: P) {
    const loading = useApiLoading(endpoint);
    return <WrappedComponent {...props} loading={loading} />;
  };
}

export default apiClient;