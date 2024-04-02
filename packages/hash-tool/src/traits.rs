pub trait SimpleDynDigest {
    fn update(&mut self, chunk: &[u8]);
    fn finalize(self: Box<Self>) -> Box<[u8]>;
}
