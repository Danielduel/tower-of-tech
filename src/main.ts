import $ from "https://deno.land/x/dax@0.26.0/mod.ts";

// const options = [
//   "Migrate",
// ] as const;
// const index = await $.select({
//   message: "What to do?",
//   options: options as unknown as string[],
// });

// switch (options[index]) {
//   case "Migrate":
//     await $`deno task migrate`;
//     break;
// }

await $`deno task migrate`;
