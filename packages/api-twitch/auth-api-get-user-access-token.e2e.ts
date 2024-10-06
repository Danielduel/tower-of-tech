// deno-lint-ignore-file no-case-declarations
import { channelReadAds, channelReadRedemptions } from "@/packages/api-twitch/helix-schema/scopes.ts";
import { channelManageBroadcast, createScopes } from "@/packages/api-twitch/helix-schema/scopes.ts";
import { open } from "https://deno.land/x/open@v0.0.6/index.ts";
import { userTokenSuccessSchema } from "@/packages/api-twitch/helix-schema/common.ts";

const client_id = Deno.env.get("TWITCH_API_CLIENT_ID")!;
const client_secret = Deno.env.get("TWITCH_API_CLIENT_SECRET")!;
const redirect_uri = "http://localhost:8080/authorize";

export const getUserToken = () =>
  new Promise<{ code: string; scope: string }>((resolve) => {
    const payload = new URLSearchParams();
    payload.append("client_id", client_id);
    payload.append("force_verify", "true");
    payload.append("redirect_uri", redirect_uri);
    payload.append("response_type", "code");
    payload.append("scope", createScopes(channelManageBroadcast, channelReadRedemptions, channelReadAds));

    const content = () => `
      <style>
        body { background: #333; color: #ccc }
        a, a:visited { background: #555; color: #ddd; padding: 2rem; display: block; }
      </style>
      Hello, world
      <a href="https://id.twitch.tv/oauth2/authorize?${payload}">
        Connect with Twitch
      </a>
    `;

    const contentSuccess = (code: string | null, scope: string | null) => `
      <style>
        body { background: #333; color: #ccc }
      </style>
      <div>
        Code: <code>${code}</code>
      </div>
      <div>
        Scope: <code>${scope}</code>
      </div>
    `;

    const server = Deno.serve({ port: 8080, hostname: "127.0.0.1" }, (req) => {
      const { url } = req;

      const _url = new URL(url);
      const { pathname, search } = _url;

      switch (true) {
        case pathname.startsWith("/authorize"):
          const searchParams = new URLSearchParams(search);
          const [code, scope] = [searchParams.get("code")!, searchParams.get("scope")!];
          setTimeout(async () => {
            await server.shutdown();
            resolve({ code, scope });
          }, 0);
          return new Response(contentSuccess(code, scope), {
            headers: { "Content-Type": "text/html" },
          });
        default:
          return new Response(content(), {
            headers: { "Content-Type": "text/html" },
          });
      }
    });

    open("http://localhost:8080/");
  })
    .then(async ({ code, scope }) => {
      const params = new URLSearchParams();
      params.append("client_id", client_id);
      params.append("client_secret", client_secret);
      params.append("code", code);
      params.append("grant_type", "authorization_code");
      params.append("redirect_uri", redirect_uri);

      const response = await fetch("https://id.twitch.tv/oauth2/token", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        body: params,
      });

      return userTokenSuccessSchema.parse(await response.json());
    });
