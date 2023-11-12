export const isDevelopment = () => {
  return Deno.env.get("TOT_ENVIRONMENT") === "development";
};
