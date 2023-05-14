import { Dialect, Sql } from "./types";

//compensate zone difference before creating string of date
export function datetimeToStr(expires?: Date): string {
  if (!expires) expires = new Date();
  const tzoffset = expires.getTimezoneOffset() * 60000; //offset in milliseconds
  const localISOTime = new Date(expires.getTime() - tzoffset).toISOString().slice(0, -1);
  return localISOTime;
}

// convert string back to date
export const parseDate = (d: Date | string | null, addZ: boolean = false): Date | null => {
  if (typeof d === "string") {
    if (addZ) d += "Z";
    return new Date(Date.parse(d));
  } else return d;
};

// replace all undefined with null in array
export function replaceUndefined(values: any[]): any[] {
  return values.map((x) => {
    if (x === undefined) return null;
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
