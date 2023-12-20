export const isLocal = () => {
  return Deno.env.get("TOT_ENVIRONMENT") === "local";
};

export const isDbEditorRemote = () => {
  return Deno.env.get("DD_EDITOR_REMOTE") === "true";
}

export const isDbDiscordBotRemote = () => {
  return Deno.env.get("DD_DISCORD_BOT_REMOTE") === "true";
}

export const isReadOnly = () => {
  return Deno.env.get("DD_EDITOR_READONLY") === "true";
};
