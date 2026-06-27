#!/usr/bin/env node
/** Writes a minimal 32x32 favicon.ico (single PNG icon). */
import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const size = 32;
const rgba = Buffer.alloc(size * size * 4);
for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4;
    const inLogo =
      (x >= 8 && x <= 24 && y >= 10 && y <= 12) ||
      (x >= 8 && x <= 20 && y >= 15 && y <= 17) ||
      (x >= 8 && x <= 22 && y >= 20 && y <= 22) ||
      (x - 24) ** 2 + (y - 22) ** 2 <= 9;
    if (inLogo) {
      rgba[i] = x >= 21 && (x - 24) ** 2 + (y - 22) ** 2 <= 9 ? 14 : 248;
      rgba[i + 1] = x >= 21 && (x - 24) ** 2 + (y - 22) ** 2 <= 9 ? 165 : 250;
      rgba[i + 2] = x >= 21 && (x - 24) ** 2 + (y - 22) ** 2 <= 9 ? 233 : 252;
      rgba[i + 3] = 255;
    } else {
      rgba[i] = 15;
      rgba[i + 1] = 23;
      rgba[i + 2] = 42;
      rgba[i + 3] = 255;
    }
  }
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

const stride = size * 4;
const raw = Buffer.alloc(size * (stride + 1));
for (let y = 0; y < size; y++) {
  raw[y * (stride + 1)] = 0;
  rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
}
const compressed = deflateSync(raw);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(size, 0);
ihdr.writeUInt32BE(size, 4);
ihdr[8] = 8;
ihdr[9] = 6;
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;
const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk("IHDR", ihdr),
  chunk("IDAT", compressed),
  chunk("IEND", Buffer.alloc(0)),
]);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
const entry = Buffer.alloc(16);
entry.writeUInt8(32, 0);
entry.writeUInt8(32, 1);
entry.writeUInt8(0, 2);
entry.writeUInt8(0, 3);
entry.writeUInt16LE(1, 4);
entry.writeUInt16LE(32, 6);
entry.writeUInt32LE(png.length, 8);
entry.writeUInt32LE(22, 12);
const ico = Buffer.concat([header, entry, png]);

writeFileSync(new URL("../public/favicon.ico", import.meta.url), ico);
console.log("Wrote public/favicon.ico");
