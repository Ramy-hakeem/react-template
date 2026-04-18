let refreshPromise: Promise<string> | null = null;

export const executeTokenRefresh = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const { store } = await import('../store');
    const { authApi } = await import('@/features/auth/api');

    // Get the query instance first
    const queryInstance = authApi.endpoints.refreshToken.initiate({});
    const dispatchResult = store.dispatch(queryInstance);

    // If the query hasn't started, force it
    if (dispatchResult.status === 'uninitialized') {
      console.log('Query is uninitialized, forcing refetch...');
      // You might need to use a different approach
    }

    // Try to use the query hook approach
    const result = await dispatchResult;
    return result.data;
  })();

  refreshPromise.finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};
