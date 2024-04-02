use crc::{Crc, Digest, CRC_32_ISO_HDLC};

use crate::traits::SimpleDynDigest;

pub struct OwnedCrc32Digest {
    _crc: Box<Crc<u32>>,
    digest: Digest<'static, u32>,
}

impl OwnedCrc32Digest {
    fn from_crc(crc: Crc<u32>) -> Self {
        let crc = Box::new(crc);

        let ptr: *const Crc<u32> = &*crc;

        let digest = unsafe {
            let crc: &'static Crc<u32> = &*ptr;
            crc.digest()
        };

        Self { _crc: crc, digest }
    }

    pub fn new() -> Self {
        Self::from_crc(Crc::<u32>::new(&CRC_32_ISO_HDLC))
    }
}

impl SimpleDynDigest for OwnedCrc32Digest {
    fn update(&mut self, bytes: &[u8]) {
        self.digest.update(bytes)
    }

    fn finalize(self: Box<OwnedCrc32Digest>) -> Box<[u8]> {
        let _crc = self._crc;
        let digest = self.digest;
        Box::new(digest.finalize().to_be_bytes())
    }
}
