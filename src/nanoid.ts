import { customAlphabet, urlAlphabet } from "nanoid";

const nanoid = customAlphabet(urlAlphabet, 12);

export default function generateNanoId(): string {
  return nanoid();
}
