import { kofi } from "@/src/tools/mdUtil.ts";

const text = `
Update map pool :rocket:

---

${kofi}
`
console.log("---")
console.log(text);
console.log("---")

const cmd = new Deno.Command(
  "/bin/sh",
  {
    args: [
      "-c",
      "echo",
      text,
      "|",
      "wl-copy"
    ]
  }
)

await cmd.output();

