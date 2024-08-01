const rootDir = "./data/beatleader-wss-history";
const parentDirs = Deno.readDirSync(rootDir);

const dataFiles = await Promise.all([...parentDirs].map((parent) => {
  const dataFileDir = `${rootDir}/${parent.name}`;
  const dataFileNames = Deno.readDirSync(dataFileDir);
  const dataFilePaths = [...dataFileNames].map(({ name }) => `${dataFileDir}/${name}`);
  return Promise.all(dataFilePaths.map((path) => Deno.readTextFile(path)));
}));

const data = dataFiles.flat()
  .flatMap((x) => JSON.parse(x))
  .flatMap((x) => {
    if (!("data" in x[0])) return null;
    return JSON.parse(x[0].data);
  });

console.log(data);

// console.log(data);

// const stripData = JSON.parse(JSON.parse(dataFiles[0][0])[0][0].data);

// console.log(stripData);
