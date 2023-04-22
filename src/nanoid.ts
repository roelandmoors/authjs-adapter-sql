import { customAlphabet, urlAlphabet } from "nanoid";

let nanoid: () => string;

export default function generateNanoId(): string {
  if (!nanoid) nanoid = customAlphabet(urlAlphabet, 12);
  return nanoid();
}
