import React, { Reducer, useEffect, useReducer, useState } from "react";

type IGenericState<T extends string | number | symbol> = {
  [key in T]: T;
};

interface IFormProps<S, A> {
  reducer: Reducer<S, A>;
  reducerState: S;
}

const createReducer = <S, A>(
  reducer: Reducer<S, A>,
  reducerState: S
): [S, React.Dispatch<A>] => {
  const [state, dispatch] = useReducer(reducer, reducerState);

  return [state, dispatch];
};

const useFormReducer = <S, A>(props: IFormProps<S, A>) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [state, dispatch] = createReducer(props.reducer, props.reducerState);

  useEffect(() => {
    setIsLoading(true);

    // Simulating an asynchronous action
    setTimeout(() => {
      setIsLoading(false);
      // Dispatch an action here if needed
      // dispatch({ type: "SOME_ACTION", payload: ... });
    }, 2000);
  }, []);

  useEffect(() => {
    if (state) {
      setIsLoading(false);
    }
  }, [state]);

  if (error) {
    return [null, null, isLoading, error];
  }

  return [state, dispatch, isLoading, error];
};

export default useFormReducer;
