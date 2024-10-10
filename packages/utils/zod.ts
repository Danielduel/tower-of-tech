import { z } from "zod";

export const zodParseInt = (x: string | undefined) => typeof x === "string" ? parseInt(x) : undefined;
export const zodParseStringAsIntSchema = z.string().transform(zodParseInt);

const zodParseDate = (x: string | number | undefined) => x ? new Date(x) : undefined;
const zodParseRFC3339Date = (x: string | number | undefined) =>
  x ? new Date((typeof x === "string" ? parseInt(x) : x) * 1000) : undefined;
export const zodParseStringAsDateSchema = z.string().transform(zodParseDate);
export const zodParseNumberAsDateSchema = z.number().transform(zodParseDate);
export const zodParseNumberAsRFC3339DateSchema = z.number().transform(zodParseRFC3339Date);
