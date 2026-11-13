export {};

declare global {
  interface Window {
    Paddle?: {
      Environment: {
        set: (env: "sandbox" | "production") => void;
      };
      Initialize: (opts: {
        token: string;
        environment?: "sandbox" | "production";
      }) => void;
      Checkout: {
        open: (opts: {
          transactionId: string;
          successUrl: string;
          cancelUrl: string;
        }) => void;
      };
    };
  }

  interface User {
    id: string;
    email: string;
    credit: number;
    subscription_expires_at: string | null;
  }
}
