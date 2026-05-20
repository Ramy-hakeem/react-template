// SSE.ts
export default function setupSSE(token: string): EventSource {
  const baseUrl = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : 'https://localhost:7260';

  // Encode token to handle special characters
  const encodedToken = encodeURIComponent(token);
  const sseUrl = `${baseUrl}/event-center/sse?access_token=${encodedToken}`;

  const eventSource = new EventSource(sseUrl);

  // Optional: Add connection timeout
  const timeoutId = setTimeout(() => {
    if (eventSource.readyState === EventSource.CONNECTING) {
      console.warn('SSE connection taking too long...');
    }
  }, 5000);

  eventSource.onopen = () => {
    clearTimeout(timeoutId);
    console.log('SSE connected');
  };

  return eventSource;
}
