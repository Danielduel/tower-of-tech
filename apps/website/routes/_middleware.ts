import { FreshContext } from "$fresh/server.ts";

// basic list to reduce bot traffic
const endsWithBlock = [
  ".php",
  ".php7"
];


export async function handler(
  req: Request,
  ctx: FreshContext,
) {
  if (endsWithBlock.some(ending => req.url.split("?")[0].endsWith(ending))) {
    return new Response("https://www.youtube.com/watch?v=E0Ok6HW9-Fw", { status: 307, headers: { location: "https://www.youtube.com/watch?v=E0Ok6HW9-Fw" }});
  }
  console.log(`Access ${req.url}`)
  console.log(ctx.route)
  const resp = await ctx.next();
  return resp;
}

