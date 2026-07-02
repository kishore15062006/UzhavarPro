// useAsync Hook for API calls
import { useState, useEffect, useCallback, useRef } from 'react';

export const useAsync = (asyncFunction, immediate = true, deps = []) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const executeIdRef = useRef(0);

  // keep a ref to the latest asyncFunction so that execute can remain stable
  const functionRef = useRef(asyncFunction);
  useEffect(() => {
    functionRef.current = asyncFunction;
  }, [asyncFunction]);

  const execute = useCallback(async (...args) => {
    setIsLoading(true);
    setError(null);
    const currentExecuteId = ++executeIdRef.current;
    try {
      const response = await functionRef.current(...args);
      if (currentExecuteId !== executeIdRef.current) {
        return;
      }

      if (response.success) {
        setData(response.data);
        return response.data;
      } else {
        setError(response.error);
        throw response.error;
      }
    } catch (err) {
      if (currentExecuteId !== executeIdRef.current) {
        return;
      }

      // Ignore standard request cancellations (e.g. from fast navigation or remounts)
      if (err?.name === 'CanceledError' || err?.message === 'canceled') {
        return;
      }

      setError(err);
      throw err;
    } finally {
      if (currentExecuteId === executeIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []); // execute does not depend on asyncFunction directly

  const depsSignature = JSON.stringify(deps);

  // when immediate is true we run the execute function; also watch deps array
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate, depsSignature]);

  return {
    isLoading,
    error,
    data,
    execute,
  };
};

export default useAsync;
