declare global {
  interface Window {
    PaystackPop?: {
      setup(options: {
        key: string;
        email: string;
        amount: number;
        ref: string;
        currency?: string;
        onClose?: () => void;
        callback: (response: { reference: string }) => void;
      }): { openIframe: () => void };
    };
  }
}

let loadingPromise: Promise<void> | null = null;

export function loadPaystackScript(): Promise<void> {
  if (typeof window !== 'undefined' && window.PaystackPop) return Promise.resolve();
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack.'));
    document.body.appendChild(script);
  });

  return loadingPromise;
}
