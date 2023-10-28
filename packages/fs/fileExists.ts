export const fileExists = async (path: string) => {
  try {
    await Deno.lstat(path);
    return true;
  } catch (e) {
    return false;
  }
}
