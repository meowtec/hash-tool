export type HashType =
  | 'md5'
  | 'sha1'
  | 'sha224'
  | 'sha256'
  | 'sha384'
  | 'sha512'
  | 'crc32'
  | 'sm3'
  | 'sha3-224'
  | 'sha3-256'
  | 'sha3-384'
  | 'sha3-512';

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
  'sha3-224',
  'sha3-256',
  'sha3-384',
  'sha3-512',
];
