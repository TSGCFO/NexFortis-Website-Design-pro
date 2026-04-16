const QBM_MAGIC_BYTES = Buffer.from([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]);

export function validateQbmMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 8) return false;
  return buffer.subarray(0, 8).equals(QBM_MAGIC_BYTES);
}
