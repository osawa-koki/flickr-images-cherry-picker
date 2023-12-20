export default function amplifiedPhotosCounter (photosCount: number, flip: boolean, rotate: boolean, count: number): number {
  let amplifiedPhotosCount = photosCount
  if (flip) {
    amplifiedPhotosCount *= 2
  }
  if (rotate) {
    amplifiedPhotosCount *= count
  }
  return amplifiedPhotosCount
}
