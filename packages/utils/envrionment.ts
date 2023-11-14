export const isLocal = () => {
  return Deno.env.get("TOT_ENVIRONMENT") === "local";
};

export const isRemote = () => {
  return Deno.env.get("TOT_REMOTE") === "remote";
}

export const isReadOnly = () => {
  return Deno.env.get("DD_EDITOR_READONLY") === "true";
};
