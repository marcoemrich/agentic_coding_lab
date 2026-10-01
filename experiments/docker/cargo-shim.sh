#!/bin/sh
# Installed as /usr/local/bin/cargo, ahead of the real cargo on PATH.
# Records one TDD event per `cargo test` for the rust-cargo stack; every other
# invocation is passed through untouched. The logic lives in the mounted
# experiments/rust_tdd.py so it can be fixed without an image rebuild. Without
# that mount (image build, ad-hoc containers) this is a plain pass-through.
SHIM=/home/experimenter/experiments/rust_tdd.py
if [ -f "$SHIM" ]; then
    exec python3 "$SHIM" shim "$@"
fi
exec /usr/local/cargo/bin/cargo "$@"
