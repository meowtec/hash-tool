use digest::DynDigest;

use crate::SimpleDynDigest;

pub struct DynDigestHash(pub Box<dyn DynDigest>);

impl SimpleDynDigest for DynDigestHash {
    fn update(&mut self, chunk: &[u8]) {
        self.0.update(chunk)
    }

    fn finalize(self: Box<Self>) -> Box<[u8]> {
        self.0.finalize()
    }
}
