export const encode = (str: string) =>
  Buffer.from(str, "utf-8").toString("base64");

export const decode = (str: string) =>
  Buffer.from(str, "base64").toString("utf-8");
