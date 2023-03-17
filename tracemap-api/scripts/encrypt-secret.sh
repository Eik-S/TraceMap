#!/usr/bin/env bash

set -euxo pipefail

if [ $# -eq 0 ]; then
  echo "Usage $0 <plain-secret>"
  exit 1
fi

SECRET="${1}"

AWS_PAGER="" aws kms encrypt \
  --key-id alias/tracemap-api \
  --cli-binary-format raw-in-base64-out \
  --plaintext ${SECRET}""
