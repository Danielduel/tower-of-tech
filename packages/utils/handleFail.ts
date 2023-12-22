export const handleFail = async <T>({
  throwableFunction,
  handleCatch,
}: {
  throwableFunction: (() => T) | (() => Promise<T>),
  handleCatch: ((error: Error) => T) | ((error: Error) => Promise<T>) | ((error: Error) => void)
}) => {
  try {
    return await throwableFunction();
  } catch (err) {
    return await handleCatch(err);
  }
}

export const reportFail = (err: Error) => {
  console.error(err);
}
