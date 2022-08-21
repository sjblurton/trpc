const objectToString = (object: Record<string, any>) => {
  if (typeof object.message === "string") return object.message;
  return JSON.stringify(object);
};

export const errorToString = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (typeof error !== "object") return "unknown error";
  if (error === null || error === undefined) return "unknown error";
  return objectToString(error);
};
