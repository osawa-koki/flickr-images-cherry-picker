import imageFlipper from './imageFlipper'
import imageRotater from './imageRotater'

export interface PhotoAmplifierArgs {
  photos: string[]
  flip: boolean
  rotate: boolean
  rotateFrom: number
  rotateTo: number
  rotateCount: number
}

interface BlobWithName {
  name: string
  blob: Blob
}

export default async function photoAmplifier (args: PhotoAmplifierArgs): Promise<BlobWithName[]> {
  const { photos, flip, rotate, rotateFrom, rotateTo, rotateCount } = args

  const blobs: BlobWithName[] = []

  const promises = photos.sort((a, b) => a.localeCompare(b)).map(async (photo, index) => {
    const blob = await fetch(photo).then(async (res) => await res.blob())
    const indexStr = index.toString().padStart(photos.length.toString().length, '0')
    blobs.push({
      name: `${indexStr}.jpg`,
      blob
    })

    if (flip) {
      const flippedBlob = await imageFlipper(blob)
      blobs.push({
        name: `${indexStr}-flipped.jpg`,
        blob: flippedBlob
      })
    }

    if (rotate) {
      const ratetedBlobs = await imageRotater(blob, rotateFrom, rotateTo, rotateCount)
      ratetedBlobs.forEach((blob, i) => {
        blobs.push({
          name: `${indexStr}-rotated-${i}.jpg`,
          blob
        })
      })
    }
  })
  await Promise.all(promises)
  return blobs
}
