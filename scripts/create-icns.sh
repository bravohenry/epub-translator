#!/bin/bash

# 检查是否提供了输入文件
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 icon.png"
    exit 1
fi

# 输入文件
INPUT=$1

# 创建临时图标目录
ICONSET="icon.iconset"
mkdir -p $ICONSET

# 生成不同尺寸的图标
sips -z 16 16     $INPUT --out "${ICONSET}/icon_16x16.png"
sips -z 32 32     $INPUT --out "${ICONSET}/icon_16x16@2x.png"
sips -z 32 32     $INPUT --out "${ICONSET}/icon_32x32.png"
sips -z 64 64     $INPUT --out "${ICONSET}/icon_32x32@2x.png"
sips -z 128 128   $INPUT --out "${ICONSET}/icon_128x128.png"
sips -z 256 256   $INPUT --out "${ICONSET}/icon_128x128@2x.png"
sips -z 256 256   $INPUT --out "${ICONSET}/icon_256x256.png"
sips -z 512 512   $INPUT --out "${ICONSET}/icon_256x256@2x.png"
sips -z 512 512   $INPUT --out "${ICONSET}/icon_512x512.png"
sips -z 1024 1024 $INPUT --out "${ICONSET}/icon_512x512@2x.png"

# 创建.icns文件
iconutil -c icns $ICONSET

# 复制到public目录
cp icon.icns public/
cp $INPUT public/icon.png

# 清理临时文件
rm -rf $ICONSET
rm icon.icns

echo "图标已生成并复制到public目录" 