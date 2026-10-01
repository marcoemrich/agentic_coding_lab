Mirror of `experiments/stacks/rust-cargo/Cargo.toml` and `Cargo.lock`, used by
the Dockerfile to fetch the pinned crates into the image's offline registry.
The build context is `experiments/docker/`, so the stack files cannot be read
directly. Keep the two in step, the way `python.cache.txt` tracks
`requirements-dev.txt`.
