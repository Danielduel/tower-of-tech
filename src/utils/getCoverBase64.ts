import { decode, Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";
import { fromUint8Array } from "https://denopkg.com/chiefbiiko/base64@master/mod.ts";
import seedColor from "npm:seed-color";
import { size, cornerPx, getPlaylistColorOverride, font, fontPx, textLayout } from "./cover-image.ts";


export const getCoverBase64 = async (coverLabel: string) => {
  const playlistName = coverLabel.split(" ").reverse()[0];

  const imageData = Deno.readFileSync(new URL(import.meta.resolve("../../assets/cover.jpg")).pathname);
  const imageBase = ((await decode(imageData)) as Image)
    .resize(size, size)
    .roundCorners(cornerPx);

  const colorOverwrite = getPlaylistColorOverride(playlistName);
  const color = seedColor.default(coverLabel).toRGB();
  const imageBackground = (new Image(size, size));
  // .fill(Image. Image.rgbToColor(color.r, color.g, color.b));
  const textImage = Image
    .renderText(font, fontPx, coverLabel, 255, textLayout)
    .contain(size, size);
  const image = imageBackground.composite(imageBase.composite(textImage, 0, 0));
  const pngEncode = await image.encode();

  Deno.writeFileSync(`./migrated/covers/${coverLabel}.png`, pngEncode);

  const pngBase64 = fromUint8Array(pngEncode);
  return `base64,${pngBase64}`;
};
