// Encrypts private/letter.html so only the numbers in private/numbers.txt can open it.
// Run after editing the letter or the numbers:   node tools/encrypt-letter.mjs
// Output: letter.enc.json (safe to commit — it holds no readable text or numbers).

import { readFileSync, writeFileSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";

const ITERATIONS = 1_000_000;
const enc = new TextEncoder();
const b64 = (buf) => Buffer.from(buf).toString("base64");

// keep the last 10 digits, so "+91 98765 43210" and "9876543210" both work
const normalize = (n) => n.replace(/\D/g, "").slice(-10);

const letter = readFileSync("private/letter.html", "utf8");
const numbers = readFileSync("private/numbers.txt", "utf8")
  .split("\n")
  .map(normalize)
  .filter((n) => n.length === 10);

if (!numbers.length) throw new Error("No 10-digit numbers found in private/numbers.txt");

// one random key encrypts the letter; each number gets its own wrapped copy of that key
const letterKey = crypto.getRandomValues(new Uint8Array(32));
const aesKey = await crypto.subtle.importKey("raw", letterKey, "AES-GCM", false, ["encrypt"]);
const iv = crypto.getRandomValues(new Uint8Array(12));
const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, aesKey, enc.encode(letter));

const salt = crypto.getRandomValues(new Uint8Array(16));
const keys = [];
for (const n of numbers) {
  const base = await crypto.subtle.importKey("raw", enc.encode(n), "PBKDF2", false, ["deriveKey"]);
  const kek = await crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );
  const kiv = crypto.getRandomValues(new Uint8Array(12));
  const wrapped = await crypto.subtle.encrypt({ name: "AES-GCM", iv: kiv }, kek, letterKey);
  keys.push({ iv: b64(kiv), key: b64(wrapped) });
}

writeFileSync(
  "letter.enc.json",
  JSON.stringify({ v: 1, iterations: ITERATIONS, salt: b64(salt), keys, iv: b64(iv), data: b64(data) }) + "\n"
);
console.log(`Encrypted the letter for ${numbers.length} number(s) -> letter.enc.json`);
