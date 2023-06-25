import { decode, Image, TextLayout } from "https://deno.land/x/imagescript@1.2.15/mod.ts";
import { fromUint8Array } from "https://denopkg.com/chiefbiiko/base64@master/mod.ts";
import seedColor from "npm:seed-color";

const fontPath = new URL(import.meta.resolve("../../assets/font.ttf")).pathname;

const size = 512;
const cornerPx = size * 212 / 512;
// const textPx = size * 350 / 512;
const fontPx = size * 64 / 512 / 2;

const font = Deno.readFileSync(fontPath);
const textLayout = new TextLayout({
  maxHeight: size,
  maxWidth: size,
  horizontalAlign: "middle",
  verticalAlign: "right",
  wrapStyle: "word"
})

export const getCoverBase64 = async (coverLabel: string) => {
  const imageData = Deno.readFileSync(new URL(import.meta.resolve("../../assets/cover.jpg")).pathname);
  const imageBase = ((await decode(imageData)) as Image)
    .resize(size, size)
    .roundCorners(cornerPx);
  
  const color = seedColor.default(coverLabel).toRGB();
  const imageBackground = (new Image(size, size))
    .fill(Image.rgbToColor(color.r, color.g, color.b));

  const textImage = Image
    .renderText(font, fontPx, coverLabel, 0x000000ff, textLayout)
    .contain(size, size)
  const image = imageBackground.composite(imageBase.composite(textImage, 0, 0));
  const pngEncode = await image.encode();

  Deno.writeFileSync(`./migrated/covers/${coverLabel}.png`, pngEncode);

  const pngBase64 = fromUint8Array(pngEncode);
  return `base64,${pngBase64}`;
}
