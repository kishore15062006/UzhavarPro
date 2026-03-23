// useAsync Hook for API calls
import { useState, useEffect, useCallback, useRef } from 'react';

export const useAsync = (asyncFunction, immediate = true, deps = []) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // keep a ref to the latest asyncFunction so that execute can remain stable
  const functionRef = useRef(asyncFunction);
  useEffect(() => {
    functionRef.current = asyncFunction;
  }, [asyncFunction]);

  const execute = useCallback(async (...args) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await functionRef.current(...args);
      if (response.success) {
        setData(response.data);
        return response.data;
      } else {
        setError(response.error);
        throw response.error;
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
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
