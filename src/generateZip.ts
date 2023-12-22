import JSZip from 'jszip'
import imageFlipper from './imageFlipper'
import imageRotater from './imageRotater'

interface GenerateZipOptions {
  photos: string[]
  flip: boolean
  rotate: boolean
  rotateFrom: number
  rotateTo: number
  rotateCount: number
}

export default async function generateZip (args: GenerateZipOptions): Promise<Blob> {
  const { photos, flip, rotate, rotateFrom, rotateTo, rotateCount } = args

  const zip = new JSZip()

  const promises = photos.sort((a, b) => a.localeCompare(b)).map(async (photo, index) => {
    const blob = await fetch(photo).then(async (res) => await res.blob())
    const indexStr = index.toString().padStart(photos.length.toString().length, '0')
    zip.file(`${indexStr}.jpg`, blob)

    if (flip) {
      const flippedBlob = await imageFlipper(blob)
      zip.file(`${indexStr}-flipped.jpg`, flippedBlob)
    }

    if (rotate) {
      const ratetedBlobs = await imageRotater(blob, rotateFrom, rotateTo, rotateCount)
      ratetedBlobs.forEach((blob, i) => {
        zip.file(`${indexStr}-rotated-${i}.jpg`, blob)
      })
    }
  })
  await Promise.all(promises)

  return await zip.generateAsync({ type: 'blob' })
}
