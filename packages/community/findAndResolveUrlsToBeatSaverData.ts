import { BeatSaverApi } from "@/packages/api-beatsaver/api.ts";
import { urlRegex } from "@/packages/utils/regex.ts";

const resolveUrlBeatSaverMaps = async (url: string) => {
  const id = url.split("https://beatsaver.com/maps/")[1].toUpperCase();
  console.log(id);
  const data = await BeatSaverApi.mapById.get({
    urlParams: {
      id,
    },
  });
  if (data.status >= 200 && data.status < 299) {
    return data.data;
  }
  return null;
};

const resolveUrl = async (url: string) => {
  switch (true) {
    case url.startsWith("https://beatsaver.com/maps/"):
      return await resolveUrlBeatSaverMaps(url);
  }
};

export const findAndResolveUrlsToBeatSaverData = async (raw: string) => {
  const urls = raw.match(urlRegex);
  if (!urls) return {
    raw,
    url: null,
    beatSaverData: null,
  };

  const url = urls[0];
  const beatSaverData = await resolveUrl(url);

  return {
    raw,
    url,
    beatSaverData,
  };
};
