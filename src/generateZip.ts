import JSZip from 'jszip'
import photoAmplifier, { type PhotoAmplifierArgs } from './photoAmplifier'

type GenerateZipOptions = PhotoAmplifierArgs

export default async function generateZip (args: GenerateZipOptions): Promise<Blob> {
  const blobsWithName = await photoAmplifier(args)

  const zip = new JSZip()

  blobsWithName.forEach(({ name, blob }) => {
    zip.file(name, blob)
  })

  return await zip.generateAsync({ type: 'blob' })
}
