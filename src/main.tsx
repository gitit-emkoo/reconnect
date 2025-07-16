
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: "https://d1d6ad9f6919ef0c71af7b65fdf87466@o4509676320587776.ingest.us.sentry.io/4509676327272448",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});

const queryClient = new QueryClient();

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container as HTMLElement);
root.render(
  <Sentry.ErrorBoundary fallback={<div>에러가 발생했습니다. 페이지를 새로고침해주세요.</div>}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Sentry.ErrorBoundary>
); 