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
export const parseUtcDate = (d: Date | string | null, addZ: boolean = false): Date | null => {
  if (typeof d === "string") {
    if (addZ) d += "Z";
    return new Date(Date.parse(d));
  } else return d;
};

// replace all undefined with null in array
export function replaceUndefined(values: Primitive[]): PrimitiveDefined[] {
  return values.map((x) => {
    if (x === undefined) return null;
    if (Number.isNaN(x)) return null;
    return x;
  });
}

// Convert template string array to sql with placeholders
export function buildParameterizedSql(o: Sql, dialect: Dialect): string {
  let sql = "";
  if (Array.isArray(sql)) {
    sql = generatePlaceholders(o as string[], dialect);
  } else if (o.hasOwnProperty("raw")) {
    sql = generatePlaceholders((o as TemplateStringsArray).raw, dialect);
  } else {
    sql = generatePlaceholders(Array.from(o), dialect);
  }
  return sql;
}

function generatePlaceholders(o: readonly string[], dialect: Dialect): string {
  if (dialect == "mysql") return o.join("?");

  let result = "";
  for (let i = 0; i < o.length - 1; i++) {
    const part = o[i];
    result += part + "$" + (i + 1).toString();
  }
  result += o[o.length - 1];
  return result;
}

export function replacePrefix(sql: Sql, prefix?: string): string[] {
  return sql.map((s) => s.replace("[TABLE_PREFIX]", prefix || ""));
}

export function isNumeric(value: string) {
  return /^\d+$/.test(value);
}
