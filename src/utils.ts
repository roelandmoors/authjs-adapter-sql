import { Dialect, Primitive, PrimitiveDefined, Sql } from "./types";

//compensate zone difference before creating string of date
export function datetimeToLocalStr(d?: Date): string {
  return datetimeToString(d, 1);
}

//compensate zone difference before creating string of date
export function datetimeToUtcStr(d?: Date): string {
  return datetimeToString(d, -1);
}

export function datetimeToString(d?: Date, correction: number = 1): string {
  if (!d) d = new Date();
  const tzoffset = d.getTimezoneOffset() * 60000 * correction; //offset in milliseconds
  const convertedTime = new Date(d.getTime() + tzoffset).toISOString().slice(0, -1);
  return convertedTime;
}

// convert string back to date
// depending on the driver it can be a string of Date object
export const createDate = (d: Date | string | null): Date | null => {
  if (typeof d === "string") {
    return new Date(Date.parse(d));
  } else return d;
};

export function replacePrefix(sql: Sql, prefix?: string): string[] {
  return sql.map((s) => s.replace("[TABLE_PREFIX]", prefix || ""));
}

export function isNumeric(value: string) {
  return /^\d+$/.test(value);
}
