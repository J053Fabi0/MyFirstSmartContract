import { useEffect, useState } from "react";

/**
 * Awaits the promise returned by `func` and sets the state to the resolved value.
 * @returns The resolved value of the promise returned by `func` or `undefined` if the promise is not resolved yet.
 */
export default function useAsyncInitialize<T>(func: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<T | undefined>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void func().then(setState), deps);

  return state;
}
