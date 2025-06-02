import { useCallback } from "react";
import { toast } from "react-hot-toast";

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
  const parseError = useCallback((error: any): ErrorDetails => {
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

    if (error.request) {
      return {
        title: "Network Error",
        message:
          "Unable to connect to server. Please check your internet connection.",
        code: "NETWORK_ERROR",
        details: error.request,
      };
    }

    if (error.name === "ValidationError" || error.errors) {
      return {
        title: "Validation Error",
        message: error.message || "Please check your input and try again.",
        code: "VALIDATION_ERROR",
        details: error.errors,
      };
    }

    if (error.code && error.message) {
      return {
        title: error.title || "Application Error",
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.details,
      };
    }

    if (error instanceof Error) {
      return {
        title: error.name || "Error",
        message: error.message || "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
        details: error.stack,
      };
    }

    if (typeof error === "string") {
      return {
        title: "Error",
        message: error,
        code: "STRING_ERROR",
      };
    }

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

  const showErrorModal = useCallback((error: ErrorDetails, title?: string) => {
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

      if (showToast) {
        showErrorToast(displayMessage, toastType);
      }

      if (showModal) {
        showErrorModal(parsedError, modalTitle);
      }

      if (onError) {
        onError(parsedError);
      }

      console.error("Error handled:", parsedError);
    },
    [parseError, showErrorToast, showErrorModal]
  );

  return {
    handleError,
    showErrorModal,
    showErrorToast,
  };
};
