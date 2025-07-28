declare global {
  interface Window {
    AppleID?: {
      auth: {
        signIn(): Promise<{
          authorization: {
            id_token: string;
            code?: string;
          };
          user?: {
            name?: {
              firstName?: string;
              lastName?: string;
            };
            email?: string;
          };
        }>;
      };
    };
  }
}

export {}; 