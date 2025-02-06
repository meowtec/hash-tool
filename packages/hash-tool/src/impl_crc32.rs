use crc::{Crc, Digest, CRC_32_ISO_HDLC};

use crate::traits::SimpleDynDigest;

pub struct Crc32Digest {
    _crc_ptr: &'static Crc<u32>,
    digest: Digest<'static, u32>,
}

impl Crc32Digest {
    fn from_crc(crc: Crc<u32>) -> Self {
        let ptr = Box::leak(Box::new(crc));
        let digest = ptr.digest();
        Self {
            _crc_ptr: ptr,
            digest,
        }
    }

    pub fn new() -> Self {
        Self::from_crc(Crc::<u32>::new(&CRC_32_ISO_HDLC))
    }
}

impl SimpleDynDigest for Crc32Digest {
    fn update(&mut self, bytes: &[u8]) {
        self.digest.update(bytes)
    }

    fn finalize(self: Box<Crc32Digest>) -> Box<[u8]> {
        let result = Box::new(self.digest.finalize().to_be_bytes());

        drop(unsafe { Box::from_raw(self._crc_ptr as *const Crc<u32> as *mut Crc<u32>) });

        result
    }
}
