import { Err, Ok } from "@/packages/utils/optionals.ts";

export const tryParse = (data?: string) => {
  try {
    if (data) {
      return Ok(JSON.parse(data));
    }
    return Ok(undefined);
  } catch (_) {
    return Err("Error parsing");
  }
};
