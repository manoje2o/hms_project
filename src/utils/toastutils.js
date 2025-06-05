import { toast } from 'react-hot-toast';

export const showSuccessToast = (message) => {
  toast.success(message, {
    position: 'top-center',
    duration: 3000,
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    position: 'top-center',
    duration: 3000,
  });
};

export const showInfoToast = (message) => {
  toast(message, {
    icon: 'ℹ️',
    position: 'top-center',
    duration: 3000,
  });
};

export const showWarningToast = (message) => {
  toast(message, {
    icon: '⚠️',
    position: 'top-center',
    duration: 3000,
  });
};
