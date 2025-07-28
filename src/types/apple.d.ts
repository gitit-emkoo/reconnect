declare global {
  interface Window {
    AppleID?: {
      init(config: {
        clientId: string;
        scope: string;
        redirectURI: string;
        state: string;
        usePopup: boolean;
      }): void;
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