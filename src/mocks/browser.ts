import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);

// Make the `worker` and `rest` references available globally,
// so they can be accessed in both ESM and CJS.
declare global {
  interface Window {
    msw: {
      worker: typeof worker;
    };
  }
}

// Expose the worker globally for debugging
if (typeof window !== 'undefined') {
  window.msw = { worker };
}
