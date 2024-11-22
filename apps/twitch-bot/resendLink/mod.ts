import { dbEditor } from "@/packages/database-editor/mod.ts";
import { manager } from "@/apps/twitch-bot/resendLink/shared.ts";

dbEditor.ResendLinkTwitchChannelSettings.forEach((settings) => {
  manager.ensureJoinedChannelFromSettings(settings.value);
});

Deno.addSignalListener("SIGINT", () => {
  manager.cleanup();
  Deno.exit();
});
