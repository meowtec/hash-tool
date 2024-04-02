export type HashType =
  | 'md5'
  | 'sha1'
  | 'sha224'
  | 'sha256'
  | 'sha384'
  | 'sha512'
  | 'crc32'
  | 'sm3'
  | 'sha3-256';

export type ID = string | number;

export type FileOrText = File | string;

export const SUPPORTED_HASHES: HashType[] = [
  'md5',
  'sha1',
  'sha224',
  'sha256',
  'sha384',
  'sha512',
  'crc32',
  'sm3',
  'sha3-256',
];
