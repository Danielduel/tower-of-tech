import { defineConfig } from "@twind/core";
import presetAutoprefix from "@twind/preset-autoprefix";
import presetTailwind from "@twind/preset-tailwind";

export default defineConfig({
  theme: {
    // add theme styles here
  },
  // @ts-ignore
  presets: [presetAutoprefix(), presetTailwind()],
});
