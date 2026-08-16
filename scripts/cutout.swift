// 用 Vision 的人像分割把背景抠掉，输出带透明通道的 PNG
// 用法: swift cutout.swift <in.jpg> <out.png>
import Foundation
import Vision
import CoreImage
import AppKit

let args = CommandLine.arguments
guard args.count >= 3 else { fputs("usage: cutout.swift <in> <out>\n", stderr); exit(1) }
let inURL = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])

guard let src = CIImage(contentsOf: inURL) else { fputs("cannot read input\n", stderr); exit(1) }
let ctx = CIContext()

let req = VNGeneratePersonSegmentationRequest()
req.qualityLevel = .accurate                 // 慢一些，但头发边缘明显更干净
req.outputPixelFormat = kCVPixelFormatType_OneComponent8

let handler = VNImageRequestHandler(ciImage: src, options: [:])
try handler.perform([req])

guard let result = req.results?.first, let maskBuf = result.pixelBuffer as CVPixelBuffer? else {
    fputs("no segmentation result\n", stderr); exit(1)
}

var mask = CIImage(cvPixelBuffer: maskBuf)
// mask 分辨率低于原图，拉伸回原尺寸
let sx = src.extent.width / mask.extent.width
let sy = src.extent.height / mask.extent.height
mask = mask.transformed(by: CGAffineTransform(scaleX: sx, y: sy))

// 边缘稍微收一点并羽化，避免留下一圈灰底描边
mask = mask
    .applyingFilter("CIColorControls", parameters: [kCIInputContrastKey: 1.6, kCIInputBrightnessKey: -0.06])
    .applyingFilter("CIGaussianBlur", parameters: [kCIInputRadiusKey: 1.2])
    .cropped(to: src.extent)

let clear = CIImage(color: .clear).cropped(to: src.extent)
guard let out = CIFilter(name: "CIBlendWithMask", parameters: [
    kCIInputImageKey: src,
    kCIInputBackgroundImageKey: clear,
    kCIInputMaskImageKey: mask,
])?.outputImage else { fputs("blend failed\n", stderr); exit(1) }

guard let cg = ctx.createCGImage(out, from: src.extent) else { fputs("render failed\n", stderr); exit(1) }
let rep = NSBitmapImageRep(cgImage: cg)
guard let data = rep.representation(using: .png, properties: [:]) else { fputs("png failed\n", stderr); exit(1) }
try data.write(to: outURL)
print("ok \(Int(src.extent.width))x\(Int(src.extent.height))")

// ── 换首图的完整流程 ────────────────────────────────────────────
// 1) 抠图：swift scripts/cutout.swift ~/Desktop/新图.jpg /tmp/cut.png
// 2) 裁到人物 + 缩放（比例按 宽/高≈0.49，否则会把 340px 宽的 hero 撑破）：
//      python3 - <<'PY'
//      from PIL import Image
//      im = Image.open("/tmp/cut.png").convert("RGBA")
//      l,t,r,b = im.getbbox()
//      pad = int((r-l)*0.04); l=max(0,l-pad); r=min(im.width,r+pad); t=max(0,t-30)
//      b = min(im.height, t + int((r-l)/0.49))
//      c = im.crop((l,t,r,b))
//      c.resize((720, int(720*c.height/c.width)), Image.LANCZOS)\
//       .save("public/images/portrait-x.webp", format="WEBP", quality=88, method=6)
//      PY
// 3) 改 src/config.js 的 photo 字段
//
// ⚠ 一定要存 WebP，别用调色板量化的 PNG：P 模式只有 1-bit 透明度，
//   会把抠图边缘那一万多个半透明像素啃成锯齿。WebP 保留完整 alpha，
//   体积还只有 PNG 的 1/8。
