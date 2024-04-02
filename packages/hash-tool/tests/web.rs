//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;
use hash_tool::HashDigest;
use wasm_bindgen_test::*;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn pass() {
    let chunk = "hello world";

    let mut md5_hasher = Hasher::new("md5");
    md5_hasher.update(chunk.as_bytes());
    let md5 = md5_hasher.finalize();
    let md5_str = hex::encode(md5);

    let mut crc32_hasher = Hasher::new("crc32");
    crc32_hasher.update(chunk.as_bytes());
    let crc32 = crc32_hasher.finalize();
    let crc32_str = hex::encode(crc32);

    assert_eq!(md5_str, "5eb63bbbe01eeed093cb22bb8f5acdc3");
}
