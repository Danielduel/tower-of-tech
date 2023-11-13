export const isDevelopment = () => {
  return Deno.env.get("TOT_ENVIRONMENT") === "development";
};

export const isRemote = () => {
  return Deno.env.get("TOT_ENVIRONMENT") === "remote";
}

export const isReadOnly = () => {
  return Deno.env.get("DD_EDITOR_READONLY") === "true";
};
