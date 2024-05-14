mod impl_crc32;
mod impl_digest;
mod traits;
mod utils;
use wasm_bindgen::prelude::*;

use impl_crc32::OwnedCrc32Digest;
use sm3::Digest as _;
use traits::SimpleDynDigest;

use crate::impl_digest::DynDigestHash;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
}

#[wasm_bindgen]
pub struct HashDigest(Box<dyn SimpleDynDigest>);

#[wasm_bindgen]
impl HashDigest {
    #[wasm_bindgen(constructor)]
    pub fn new(hash_type: &str) -> Self {
        let digest: Box<dyn SimpleDynDigest> = match hash_type {
            "md5" => Box::new(DynDigestHash(Box::new(md5::Md5::default()))),
            "sha1" => Box::new(DynDigestHash(Box::new(sha1::Sha1::default()))),
            "sha224" => Box::new(DynDigestHash(Box::new(sha2::Sha224::default()))),
            "sha256" => Box::new(DynDigestHash(Box::new(sha2::Sha256::default()))),
            "sha384" => Box::new(DynDigestHash(Box::new(sha2::Sha384::default()))),
            "sha512" => Box::new(DynDigestHash(Box::new(sha2::Sha512::default()))),
            "sha3-224" => Box::new(DynDigestHash(Box::new(sha3::Sha3_224::new()))),
            "sha3-256" => Box::new(DynDigestHash(Box::new(sha3::Sha3_256::new()))),
            "sha3-384" => Box::new(DynDigestHash(Box::new(sha3::Sha3_384::new()))),
            "sha3-512" => Box::new(DynDigestHash(Box::new(sha3::Sha3_512::new()))),
            "sm3" => Box::new(DynDigestHash(Box::new(sm3::Sm3::new()))),
            "crc32" => Box::new(OwnedCrc32Digest::new()),
            _ => unimplemented!("unsupported digest: {}", hash_type),
        };

        Self(digest)
    }

    #[wasm_bindgen]
    pub fn update(&mut self, chunk: &[u8]) {
        self.0.update(chunk);
    }

    #[wasm_bindgen]
    pub fn finalize(self) -> Box<[u8]> {
        self.0.finalize()
    }
}
