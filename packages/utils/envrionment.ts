export const isDevelopment = () => {
  return Deno.env.get("ENVIRONMENT") === "development";
};
