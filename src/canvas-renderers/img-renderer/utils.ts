import { Image } from "canvas";

export function getImageRatio(image: Image) {
  return image.naturalWidth / image.naturalHeight
}

export function getImageHeight(image: Image, width: number) {
  const ratio = image.naturalWidth / image.naturalHeight
  return width / ratio
}

export function getImageWidth(image: Image, height: number) {
  const ratio = image.naturalWidth / image.naturalHeight
  return height * ratio
}
