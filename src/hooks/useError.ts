import { useCallback } from "react";
import { toast } from "react-hot-toast";

// Types
interface ErrorDetails {
  title?: string;
  message: string;
  code?: string | number;
  statusCode?: number;
  details?: any;
}

interface ErrorHandlerOptions {
  showToast?: boolean;
  showModal?: boolean;
  toastType?: "error" | "warning" | "info";
  modalTitle?: string;
  customMessage?: string;
  onError?: (error: ErrorDetails) => void;
}

interface UseErrorReturn {
  handleError: (error: Error | any, options?: ErrorHandlerOptions) => void;
  showErrorModal: (error: ErrorDetails, title?: string) => void;
  showErrorToast: (
    message: string,
    type?: "error" | "warning" | "info"
  ) => void;
}

// Assuming you have a modal context or state management
// Replace this with your actual modal implementation
declare global {
  interface Window {
    showModal?: (config: {
      title: string;
      content: string;
      type?: "error" | "warning" | "info";
      onClose?: () => void;
    }) => void;
  }
}

export const useError = (): UseErrorReturn => {
  // Parse different error types into a standardized format
  const parseError = useCallback((error: any): ErrorDetails => {
    // Handle Axios errors
    if (error.response) {
      return {
        title: `HTTP ${error.response.status} Error`,
        message:
          error.response.data?.message ||
          error.response.data?.error ||
          error.message ||
          "Request failed",
        code: error.response.data?.code,
        statusCode: error.response.status,
        details: error.response.data,
      };
    }

    // Handle network errors
    if (error.request) {
      return {
        title: "Network Error",
        message:
          "Unable to connect to server. Please check your internet connection.",
        code: "NETWORK_ERROR",
        details: error.request,
      };
    }

    // Handle validation errors (common in forms)
    if (error.name === "ValidationError" || error.errors) {
      return {
        title: "Validation Error",
        message: error.message || "Please check your input and try again.",
        code: "VALIDATION_ERROR",
        details: error.errors,
      };
    }

    // Handle custom API errors
    if (error.code && error.message) {
      return {
        title: error.title || "Application Error",
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.details,
      };
    }

    // Handle standard Error objects
    if (error instanceof Error) {
      return {
        title: error.name || "Error",
        message: error.message || "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
        details: error.stack,
      };
    }

    // Handle string errors
    if (typeof error === "string") {
      return {
        title: "Error",
        message: error,
        code: "STRING_ERROR",
      };
    }

    // Fallback for unknown error types
    return {
      title: "Unknown Error",
      message: "An unexpected error occurred. Please try again.",
      code: "UNKNOWN_ERROR",
      details: error,
    };
  }, []);

  // Show error toast
  const showErrorToast = useCallback(
    (message: string, type: "error" | "warning" | "info" = "error") => {
      const toastOptions = {
        duration: type === "error" ? 6000 : 4000,
        style: {
          borderRadius: "8px",
          background:
            type === "error"
              ? "#ef4444"
              : type === "warning"
              ? "#f59e0b"
              : "#3b82f6",
          color: "#fff",
        },
      };

      switch (type) {
        case "error":
          toast.error(message, toastOptions);
          break;
        case "warning":
          toast(message, { ...toastOptions, icon: "⚠️" });
          break;
        case "info":
          toast(message, { ...toastOptions, icon: "ℹ️" });
          break;
      }
    },
    []
  );

  // Show error modal
  const showErrorModal = useCallback((error: ErrorDetails, title?: string) => {
    // Replace this with your actual modal implementation
    // Example implementations:

    // Option 1: Using a global modal function
    if (window.showModal) {
      window.showModal({
        title: title || error.title || "Error",
        content: `
          <div>
            <p><strong>Message:</strong> ${error.message}</p>
            ${error.code ? `<p><strong>Code:</strong> ${error.code}</p>` : ""}
            ${
              error.statusCode
                ? `<p><strong>Status:</strong> ${error.statusCode}</p>`
                : ""
            }
          </div>
        `,
        type: "error",
      });
    }

    // Option 2: Using a modal context (uncomment and adapt)
    // const { openModal } = useModal();
    // openModal('error', {
    //   title: title || error.title || 'Error',
    //   message: error.message,
    //   code: error.code,
    //   statusCode: error.statusCode,
    //   details: error.details
    // });

    // Option 3: Using state management (Redux, Zustand, etc.)
    // dispatch(showModal({ type: 'error', data: error }));

    console.error("Error Details:", error);
  }, []);

  // Main error handler
  const handleError = useCallback(
    (error: Error | any, options: ErrorHandlerOptions = {}) => {
      const {
        showToast = true,
        showModal = false,
        toastType = "error",
        modalTitle,
        customMessage,
        onError,
      } = options;

      const parsedError = parseError(error);
      const displayMessage = customMessage || parsedError.message;

      // Show toast notification
      if (showToast) {
        showErrorToast(displayMessage, toastType);
      }

      // Show modal if requested
      if (showModal) {
        showErrorModal(parsedError, modalTitle);
      }

      // Call custom error handler if provided
      if (onError) {
        onError(parsedError);
      }

      // Log error for debugging
      console.error("Error handled:", parsedError);

      // Optional: Send to error tracking service
      // trackError(parsedError);
    },
    [parseError, showErrorToast, showErrorModal]
  );

  return {
    handleError,
    showErrorModal,
    showErrorToast,
  };
};

// Usage examples:
/*
const MyComponent = () => {
  const { handleError, showErrorToast, showErrorModal } = useError();

  const handleApiCall = async () => {
    try {
      await api.getData();
    } catch (error) {
      // Simple error handling with toast
      handleError(error);
      
      // Or with custom options
      handleError(error, {
        showToast: true,
        showModal: true,
        modalTitle: 'API Error',
        customMessage: 'Failed to load data. Please try again.',
        onError: (errorDetails) => {
          // Custom logic like redirecting on auth errors
          if (errorDetails.statusCode === 401) {
            router.push('/login');
          }
        }
      });
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      await api.submitForm(data);
      showErrorToast('Form submitted successfully!', 'info');
    } catch (error) {
      handleError(error, {
        showToast: false,
        showModal: true,
        modalTitle: 'Form Submission Error'
      });
    }
  };

  return (
    // Your component JSX
  );
};
*/
