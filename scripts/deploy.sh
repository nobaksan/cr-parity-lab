#!/bin/bash
# 배포 스크립트
for f in $(ls dist/*.txt); do
  echo $f
done
rm -rf $BUILD_DIR/*
