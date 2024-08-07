// deno-lint-ignore-file no-async-promise-executor

import { Err, Ok } from "https://deno.land/x/optionals@v3.0.0/mod.ts";
import { BeatLeaderGeneralSocketAccepted, BeatLeaderGeneralSocketAny } from "@/apps/beatleader-bot/beatleader-zod.ts";

const rootDir = "./data/beatleader-wss-history";
const parentDirs = Deno.readDirSync(rootDir);

const data = await Promise.all([...parentDirs].map((parent) => {
  const dataFileDir = `${rootDir}/${parent.name}`;
  const dataFileNames = Deno.readDirSync(dataFileDir);
  const dataFilePaths = [...dataFileNames].map(({ name }) => `${dataFileDir}/${name}`);
  return Promise.all(
    dataFilePaths
      .map((path) =>
        new Promise(async (resolve) => {
          try {
            const dataRaw = await Deno.readTextFile(path);
            const dataOuter = JSON.parse(dataRaw)[0][0];
            if (!("data" in dataOuter)) return resolve(Err("No data"));
            const dataInner = JSON.parse(dataOuter.data);
            return resolve(Ok({
              path,
              dataRaw,
              dataOuter,
              dataInner,
            }));
          } catch (_) {
            console.log(path);
            return resolve(Err("Error reading file"));
          }
        })
      ),
  );
}));

data.forEach((items) => {
  items.forEach((item) => {
    const unwrapData = (item as any).unwrap();
    try {
      const itemData = unwrapData.dataInner;
      const parsed = BeatLeaderGeneralSocketAny.parse(itemData);
      if (parsed.message === "accepted") {
        BeatLeaderGeneralSocketAccepted.parse(itemData);
        // console.log(`${parsed.message} - ok`);
      } else {
        // console.log(`${parsed.message} - skip`);
      }
    } catch (err) {
      console.log(unwrapData.path);
      console.error(err);
    }
  });
});

// console.log(data);

// const stripData = JSON.parse(JSON.parse(dataFiles[0][0])[0][0].data);

// console.log(stripData);
