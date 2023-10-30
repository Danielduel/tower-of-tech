#!/bin/bash
DATA_DIR="./data/s3"

if [ -n "$1" ]; then
	DATA_DIR="$1"
fi

if [ -z "$RUST_LOG" ]; then
    export RUST_LOG="s3s_fs=debug,s3s=debug"
fi

s3s-fs \
    --access-key    AKEXAMPLES3S    \
    --secret-key    SKEXAMPLES3S    \
    --host          localhost       \
    --port          8014            \
    --domain-name   localhost:8014  \
    "$DATA_DIR"
