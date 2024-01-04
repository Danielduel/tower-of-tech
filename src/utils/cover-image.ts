import { decode, Image, TextLayout } from "https://deno.land/x/imagescript@1.2.15/mod.ts";
import { fromUint8Array } from "https://denopkg.com/chiefbiiko/base64@master/mod.ts";
import seedColor from "npm:seed-color";
import { Color } from "https://deno.land/x/color@v0.3.0/mod.ts";

const fromAssets = (pathInAssets: string) => new URL(import.meta.resolve(`../../assets/${pathInAssets}`)).pathname;

// const fontPath = new URL(import.meta.resolve("../../assets/font.ttf")).pathname;
const fontPath = fromAssets("PathwayExtreme_28pt-Light.ttf");

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
});

const getPlaylistColorOverride = (playlistName: string) => {
  const color = (() => {
    switch (true) {
      // Misc:
      case playlistName.startsWith("Old"): return "#3b4252";

      // ToT:
      // slower will be #4c566a
      case playlistName.startsWith("Adep"): return "#5e81ac";
      case playlistName.startsWith("Acc"): return "#88c0d0";
      case playlistName.startsWith("Mid"): return "#a3be8c";
      case playlistName.startsWith("Fas"): return "#ebcb8b";
      case playlistName.startsWith("Sonic"): return "#d08770";
      // superfast will be #bf616a
      // faster than superfast will be #d8dee9

      // ToT Misc:
      case playlistName.startsWith("Rainbow"): return "#b48ead";
      default: return null;
    }
  })();

  if (!color) return null;
  return Color.string(color);
}

const getPlaylistCover = (playlistName: string) => {
  switch (true) {
    // ToT:
    case playlistName.endsWith("Comfy"): return fromAssets("detail/comfy.png");
    case playlistName.endsWith("Tech"): return fromAssets("detail/tech.png");
    case playlistName.endsWith("Hitech"): return fromAssets("detail/hitech.png");
    case playlistName.endsWith("Anglehell"): return fromAssets("detail/anglehell.png");
    case playlistName.endsWith("Tempo"): return fromAssets("detail/tempo.png");

    // ToT Misc:
    case playlistName.endsWith("Surf"): return fromAssets("detail/surf.png");
    default: return fromAssets("cover.jpg");
  }
}

const shouldApplyPlaylistCoverEffect = (playlistName: string) => {
  switch (true) {
    case playlistName.endsWith("Comfy"):
    case playlistName.endsWith("Tech"):
    case playlistName.endsWith("Hitech"):
    case playlistName.endsWith("Anglehell"):
    case playlistName.endsWith("Tempo"):
      return true;
    default:
      return false;
  }
}

export const getCoverBase64 = async (coverLabel: string) => {
  const playlistName = coverLabel.split(" ").reverse()[0];

  const shouldApplyEffect = shouldApplyPlaylistCoverEffect(playlistName);
  const imageData = Deno.readFileSync(getPlaylistCover(playlistName));
  const imageCover = shouldApplyEffect
    ? ((await decode(imageData)) as Image)
        .resize(size, size)
        .crop(size / 7, size / 7, size / 7 * 5, size / 7 * 5)
        .roundCorners(size / 2.2)
        .rotate(180)
        .roundCorners(size / 2.2)
        .rotate(99)
    : ((await decode(imageData)) as Image)
        .resize(size, size)
        .roundCorners(cornerPx);
  const _imageBase = new Image(size, size);
  const imageBase = _imageBase
    .composite(
      imageCover,
      (_imageBase.width - imageCover.width) / 2,
      (_imageBase.height - imageCover.height) / 2
    )
  
  const colorOverride = getPlaylistColorOverride(playlistName);
  const color = seedColor.default(coverLabel).toRGB();
  const imageBackground = (new Image(size, size))
    .fill(
      colorOverride
      ? Image.rgbToColor(colorOverride.red(), colorOverride.green(), colorOverride.blue())
      : Image.rgbToColor(color.r, color.g, color.b));

  const paddingX = 15;
  const paddingY = 8;
  const marginY = 4;
  const _textImage = Image
    .renderText(font, fontPx, colorOverride ? playlistName : coverLabel, 0x000000ff, textLayout);
  const textImage = (new Image(_textImage.width + paddingX * 2, _textImage.height + paddingY * 2))
    .fill(0xFFFFFFFF)
    .roundCorners(paddingX)
    .composite(_textImage, paddingX, paddingY);

  const image = imageBackground
    .composite(imageBase.composite(
      textImage,
      (imageBackground.width - textImage.width) / 2,
      imageBackground.height - textImage.height - marginY
    ));
  const pngEncode = await image.encode();

  Deno.writeFileSync(`./migrated/covers/${coverLabel}.png`, pngEncode);

  const pngBase64 = fromUint8Array(pngEncode);
  return `base64,${pngBase64}`;
}
