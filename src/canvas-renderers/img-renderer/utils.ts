import type { ImageLike } from "../../engine/types";

export function getImageRatio(image: ImageLike) {
  return image.naturalWidth / image.naturalHeight
}

export function getImageHeight(image: ImageLike, width: number) {
  const ratio = image.naturalWidth / image.naturalHeight
  return width / ratio
}

export function getImageWidth(image: ImageLike, height: number) {
  const ratio = image.naturalWidth / image.naturalHeight
  return height * ratio
}
