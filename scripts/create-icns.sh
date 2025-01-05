#!/bin/bash

# 创建临时iconset目录
mkdir -p Appicon.iconset

# 生成不同尺寸的图标
sips -z 16 16     Appicon.png --out Appicon.iconset/icon_16x16.png
sips -z 32 32     Appicon.png --out Appicon.iconset/icon_16x16@2x.png
sips -z 32 32     Appicon.png --out Appicon.iconset/icon_32x32.png
sips -z 64 64     Appicon.png --out Appicon.iconset/icon_32x32@2x.png
sips -z 128 128   Appicon.png --out Appicon.iconset/icon_128x128.png
sips -z 256 256   Appicon.png --out Appicon.iconset/icon_128x128@2x.png
sips -z 256 256   Appicon.png --out Appicon.iconset/icon_256x256.png
sips -z 512 512   Appicon.png --out Appicon.iconset/icon_256x256@2x.png
sips -z 512 512   Appicon.png --out Appicon.iconset/icon_512x512.png
sips -z 1024 1024 Appicon.png --out Appicon.iconset/icon_512x512@2x.png

# 创建icns文件
iconutil -c icns Appicon.iconset

# 移动到public目录
mv Appicon.icns public/icon.icns

# 清理临时文件
rm -rf Appicon.iconset 