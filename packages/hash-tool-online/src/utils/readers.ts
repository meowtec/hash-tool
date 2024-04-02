interface Reader {
  get byteLength(): number;

  read(start: number, length: number): Promise<Uint8Array>;
}
export class Uint8ArrayReader implements Reader {
  constructor(private data: Uint8Array) {}

  get byteLength() {
    return this.data.byteLength;
  }

  read(start: number, length: number) {
    const len = Math.min(length, this.byteLength - start);

    return Promise.resolve(
      // slice without copy
      new Uint8Array(
        this.data.buffer,
        this.data.byteOffset + start,
        this.data.byteOffset + start + len
      )
    );
  }
}
export class BlobReader implements Reader {
  constructor(private data: Blob) {}

  get byteLength() {
    return this.data.size;
  }

  async read(start: number, length: number) {
    const buffer = await this.data.slice(start, start + length).arrayBuffer();

    return new Uint8Array(buffer);
  }
}
