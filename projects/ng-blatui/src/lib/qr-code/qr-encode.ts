/*
 * A compact, self-contained QR encoder: byte mode, error-correction level M,
 * versions 1-10, GF(256) Reed-Solomon, all 8 data masks with penalty scoring.
 * Index/bit arithmetic over a 2D grid is intrinsic here, so a few low-level
 * lint rules are relaxed for this module only.
 */
/* eslint-disable unicorn/no-for-loop, sonarjs/cognitive-complexity, unicorn/no-break-in-nested-loop, unicorn/no-computed-property-existence-check */

// --- GF(256) tables (primitive polynomial 0x11d) ---
function buildTables(): { exp: number[]; log: number[] } {
  const exp = Array.from({ length: 512 }, () => 0);
  const log = Array.from({ length: 256 }, () => 0);
  let x = 1;
  for (let index = 0; index < 255; index += 1) {
    exp[index] = x;
    log[x] = index;
    x <<= 1;
    if ((x & 0x1_00) !== 0) {
      x ^= 0x1_1d;
    }
  }
  for (let index = 255; index < 512; index += 1) {
    exp[index] = exp[index - 255];
  }
  return { exp, log };
}
const { exp: EXP, log: LOG } = buildTables();
function gfMul(a: number, b: number): number {
  return a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]];
}

function rsGenerator(degree: number): number[] {
  let poly = [1];
  for (let d = 0; d < degree; d += 1) {
    const next = Array.from({ length: poly.length + 1 }, () => 0);
    for (let index = 0; index < poly.length; index += 1) {
      next[index] ^= gfMul(poly[index], EXP[d]);
      next[index + 1] ^= poly[index];
    }
    poly = next;
  }
  return poly;
}
function rsEncode(data: number[], ecLength: number): number[] {
  const gen = rsGenerator(ecLength);
  const remainder = Array.from({ length: ecLength }, () => 0);
  for (const byte of data) {
    const factor = byte ^ remainder[0];
    remainder.shift();
    remainder.push(0);
    for (let index = 0; index < ecLength; index += 1) {
      remainder[index] ^= gfMul(gen[index + 1], factor);
    }
  }
  return remainder;
}

// --- version tables (level M) ---
interface BlockGroup {
  count: number;
  dataLen: number;
}
const VERSIONS: { ec: number; groups: BlockGroup[] }[] = [
  { ec: 10, groups: [{ count: 1, dataLen: 16 }] },
  { ec: 16, groups: [{ count: 1, dataLen: 28 }] },
  { ec: 26, groups: [{ count: 1, dataLen: 44 }] },
  { ec: 18, groups: [{ count: 2, dataLen: 32 }] },
  { ec: 24, groups: [{ count: 2, dataLen: 43 }] },
  { ec: 16, groups: [{ count: 4, dataLen: 27 }] },
  { ec: 18, groups: [{ count: 4, dataLen: 31 }] },
  {
    ec: 22,
    groups: [
      { count: 2, dataLen: 38 },
      { count: 2, dataLen: 39 },
    ],
  },
  {
    ec: 22,
    groups: [
      { count: 3, dataLen: 36 },
      { count: 2, dataLen: 37 },
    ],
  },
  {
    ec: 26,
    groups: [
      { count: 4, dataLen: 43 },
      { count: 1, dataLen: 44 },
    ],
  },
];
const CAPACITY = [14, 26, 42, 62, 84, 106, 122, 152, 180, 213];
const ALIGN: number[][] = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
];

function dataCodewords(version: number): number {
  return VERSIONS[version - 1].groups.reduce((sum, g) => sum + g.count * g.dataLen, 0);
}

function pickVersion(byteLength: number): number {
  for (let v = 1; v <= 10; v += 1) {
    if (byteLength <= CAPACITY[v - 1]) {
      return v;
    }
  }
  return 10;
}

// --- bit stream ---
function buildCodewords(bytes: number[], version: number): number[] {
  const bits: number[] = [];
  const push = (value: number, length: number): void => {
    for (let index = length - 1; index >= 0; index -= 1) {
      bits.push((value >> index) & 1);
    }
  };
  const countBits = version >= 10 ? 16 : 8;
  push(0b0100, 4); // byte mode
  push(bytes.length, countBits);
  for (const byte of bytes) {
    push(byte, 8);
  }
  const total = dataCodewords(version);
  const capacityBits = total * 8;
  for (let index = 0; index < 4 && bits.length < capacityBits; index += 1) {
    bits.push(0); // terminator
  }
  while (bits.length % 8 !== 0) {
    bits.push(0);
  }
  const codewords: number[] = [];
  for (let index = 0; index < bits.length; index += 8) {
    let byte = 0;
    for (let index_ = 0; index_ < 8; index_ += 1) {
      byte = (byte << 1) | bits[index + index_];
    }
    codewords.push(byte);
  }
  const pad = [0xec, 0x11];
  let p = 0;
  while (codewords.length < total) {
    codewords.push(pad[p % 2]);
    p += 1;
  }
  return codewords;
}

function interleave(codewords: number[], version: number): number[] {
  const { ec, groups } = VERSIONS[version - 1];
  const dataBlocks: number[][] = [];
  const ecBlocks: number[][] = [];
  let offset = 0;
  for (const group of groups) {
    for (let b = 0; b < group.count; b += 1) {
      const block = codewords.slice(offset, offset + group.dataLen);
      offset += group.dataLen;
      dataBlocks.push(block);
      ecBlocks.push(rsEncode(block, ec));
    }
  }
  const result: number[] = [];
  const maxData = Math.max(...dataBlocks.map((b) => b.length));
  for (let index = 0; index < maxData; index += 1) {
    for (const block of dataBlocks) {
      if (index < block.length) {
        result.push(block[index]);
      }
    }
  }
  for (let index = 0; index < ec; index += 1) {
    for (const block of ecBlocks) {
      result.push(block[index]);
    }
  }
  return result;
}

// --- matrix ---
type Grid = (boolean | null)[][];

function emptyGrid(size: number): Grid {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => null));
}

function placeFinder(grid: Grid, reserved: boolean[][], row: number, col: number): void {
  for (let r = -1; r <= 7; r += 1) {
    for (let c = -1; c <= 7; c += 1) {
      const rr = row + r;
      const cc = col + c;
      if (rr < 0 || rr >= grid.length || cc < 0 || cc >= grid.length) {
        continue;
      }
      const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
      const isCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      grid[rr][cc] = isBorder || isCore;
      reserved[rr][cc] = true;
    }
  }
}

function placeAlignment(grid: Grid, reserved: boolean[][], version: number): void {
  const centers = ALIGN[version - 1];
  const last = centers.length - 1;
  for (let index = 0; index < centers.length; index += 1) {
    for (let index_ = 0; index_ < centers.length; index_ += 1) {
      if (
        (index === 0 && index_ === 0) ||
        (index === 0 && index_ === last) ||
        (index === last && index_ === 0)
      ) {
        continue;
      }
      const row = centers[index];
      const col = centers[index_];
      for (let r = -2; r <= 2; r += 1) {
        for (let c = -2; c <= 2; c += 1) {
          grid[row + r][col + c] = Math.max(Math.abs(r), Math.abs(c)) !== 1;
          reserved[row + r][col + c] = true;
        }
      }
    }
  }
}

function reserveFormat(reserved: boolean[][], size: number): void {
  for (let index = 0; index < 9; index += 1) {
    reserved[8][index] = true;
    reserved[index][8] = true;
  }
  for (let index = 0; index < 8; index += 1) {
    reserved[8][size - 1 - index] = true;
    reserved[size - 1 - index][8] = true;
  }
}

function placeFunctionPatterns(grid: Grid, reserved: boolean[][], version: number): void {
  const size = grid.length;
  placeFinder(grid, reserved, 0, 0);
  placeFinder(grid, reserved, 0, size - 7);
  placeFinder(grid, reserved, size - 7, 0);
  // timing patterns
  for (let index = 8; index < size - 8; index += 1) {
    const isBit = index % 2 === 0;
    grid[6][index] = isBit;
    grid[index][6] = isBit;
    reserved[6][index] = true;
    reserved[index][6] = true;
  }
  placeAlignment(grid, reserved, version);
  // dark module
  grid[size - 8][8] = true;
  reserved[size - 8][8] = true;
  reserveFormat(reserved, size);
}

function placeData(grid: Grid, reserved: boolean[][], bitsArray: number[]): void {
  const size = grid.length;
  let bitIndex = 0;
  let isUpward = true;
  for (let col = size - 1; col > 0; col -= 2) {
    const c0 = col === 6 ? col - 1 : col;
    for (let index = 0; index < size; index += 1) {
      const row = isUpward ? size - 1 - index : index;
      for (let k = 0; k < 2; k += 1) {
        const cc = c0 - k;
        if (reserved[row][cc]) {
          continue;
        }
        grid[row][cc] = bitIndex < bitsArray.length && bitsArray[bitIndex] === 1;
        bitIndex += 1;
      }
    }
    isUpward = !isUpward;
  }
}

function shouldMaskModule(mask: number, row: number, col: number): boolean {
  switch (mask) {
    case 0: {
      return (row + col) % 2 === 0;
    }
    case 1: {
      return row % 2 === 0;
    }
    case 2: {
      return col % 3 === 0;
    }
    case 3: {
      return (row + col) % 3 === 0;
    }
    case 4: {
      return (Math.floor(row / 2) + Math.floor(col / 3)) % 2 === 0;
    }
    case 5: {
      return ((row * col) % 2) + ((row * col) % 3) === 0;
    }
    case 6: {
      return (((row * col) % 2) + ((row * col) % 3)) % 2 === 0;
    }
    default: {
      return (((row + col) % 2) + ((row * col) % 3)) % 2 === 0;
    }
  }
}

function applyMask(grid: Grid, reserved: boolean[][], mask: number): boolean[][] {
  const size = grid.length;
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => {
      const isValue = grid[row][col] === true;
      if (reserved[row][col]) {
        return isValue;
      }
      return isValue !== shouldMaskModule(mask, row, col);
    }),
  );
}

function penalty(matrix: boolean[][]): number {
  const size = matrix.length;
  let score = 0;
  // rule 1: runs of 5+
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      for (const [dr, dc] of [
        [0, 1],
        [1, 0],
      ]) {
        if (c + dc * 4 >= size || r + dr * 4 >= size) {
          continue;
        }
        let run = 1;
        while (
          r + dr * run < size &&
          c + dc * run < size &&
          matrix[r + dr * run][c + dc * run] === matrix[r][c]
        ) {
          run += 1;
        }
        if (run >= 5) {
          score += 3 + (run - 5);
        }
      }
    }
  }
  // rule 3: finder-like patterns
  const pattern = [true, false, true, true, true, false, true];
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      let isHorizontal = c + 6 < size;
      let isVertical = r + 6 < size;
      for (let k = 0; k < 7; k += 1) {
        if (isHorizontal && matrix[r][c + k] !== pattern[k]) {
          isHorizontal = false;
        }
        if (isVertical && matrix[r + k][c] !== pattern[k]) {
          isVertical = false;
        }
      }
      if (isHorizontal) {
        score += 40;
      }
      if (isVertical) {
        score += 40;
      }
    }
  }
  return score;
}

function bchFormat(data: number): number {
  let value = data << 10;
  const generator = 0b101_0011_0111;
  for (let index = 14; index >= 10; index -= 1) {
    if (((value >> index) & 1) !== 0) {
      value ^= generator << (index - 10);
    }
  }
  return ((data << 10) | value) ^ 0b101_0100_0001_0010;
}

function placeFormat(matrix: boolean[][], mask: number): void {
  const size = matrix.length;
  const bits = bchFormat(mask); // level M = 0, so format data = mask
  for (let index = 0; index < 15; index += 1) {
    const isBit = ((bits >> index) & 1) === 1;
    if (index < 6) {
      matrix[8][index] = isBit;
    } else if (index < 8) {
      matrix[8][index + 1] = isBit;
    } else {
      matrix[8][size - 15 + index] = isBit;
    }
    if (index < 8) {
      matrix[size - 1 - index][8] = isBit;
    } else if (index < 9) {
      matrix[7][8] = isBit;
    } else {
      matrix[14 - index][8] = isBit;
    }
  }
}

function utf8Bytes(text: string): number[] {
  const out: number[] = [];
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;
    if (code < 0x80) {
      out.push(code);
    } else if (code < 0x8_00) {
      out.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else if (code < 0x1_00_00) {
      out.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    } else {
      out.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f),
      );
    }
  }
  return out;
}

/** Encode `text` into a QR module matrix (true = dark). Level M, versions 1-10. */
export function encodeQr(text: string): boolean[][] {
  const bytes = utf8Bytes(text);
  const version = pickVersion(bytes.length);
  const size = 17 + version * 4;
  const codewords = buildCodewords(bytes.slice(0, CAPACITY[version - 1]), version);
  const finalBytes = interleave(codewords, version);
  const bitsArray: number[] = [];
  for (const byte of finalBytes) {
    for (let index = 7; index >= 0; index -= 1) {
      bitsArray.push((byte >> index) & 1);
    }
  }

  const grid = emptyGrid(size);
  const reserved = Array.from({ length: size }, () => Array.from({ length: size }, () => false));
  placeFunctionPatterns(grid, reserved, version);
  placeData(grid, reserved, bitsArray);

  let best: boolean[][] = [];
  let bestScore = Infinity;
  for (let mask = 0; mask < 8; mask += 1) {
    const candidate = applyMask(grid, reserved, mask);
    placeFormat(candidate, mask);
    const score = penalty(candidate);
    if (score < bestScore) {
      bestScore = score;
      best = candidate;
    }
  }
  return best;
}
