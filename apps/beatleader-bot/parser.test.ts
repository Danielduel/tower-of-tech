// deno-lint-ignore-file no-async-promise-executor

import { Err, Ok } from "https://deno.land/x/optionals@v3.0.0/mod.ts";
import { z } from "zod";

const rootDir = "./data/beatleader-wss-history";
const parentDirs = Deno.readDirSync(rootDir);

const data = await Promise.all([...parentDirs].map((parent) => {
  const dataFileDir = `${rootDir}/${parent.name}`;
  const dataFileNames = Deno.readDirSync(dataFileDir);
  const dataFilePaths = [...dataFileNames].map(({ name }) => `${dataFileDir}/${name}`);
  return Promise.all(
    dataFilePaths
      .filter((x) => !x.endsWith("-skip"))
      // .filter((_, index) => index === 12)
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
            console.error(`Problem with ${path}`);
          }
        })
      ),
  );
}));

console.log(data);

// data.forEach(async (data) => {
//   console.log(data);
// });

// console.log(data);

// const stripData = JSON.parse(JSON.parse(dataFiles[0][0])[0][0].data);

// console.log(stripData);
