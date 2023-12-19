export default async function imageRotater (image: Blob, from: number, to: number, count: number): Promise<Blob[]> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (ctx == null) {
    throw new Error('Failed to create canvas context')
  }
  const canvasImgSrc = document.createElement('img')
  canvasImgSrc.src = URL.createObjectURL(image)
  await new Promise((resolve, reject) => {
    canvasImgSrc.onload = () => {
      canvas.width = canvasImgSrc.width
      canvas.height = canvasImgSrc.height
      resolve(null)
    }
    canvasImgSrc.onerror = () => { reject(new Error('Failed to load image')) }
  })
  const result: Blob[] = []
  for (let i = 0; i < count; i++) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((from + (to - from) * i / count) * Math.PI / 180)
    ctx.drawImage(canvasImgSrc, -canvas.width / 2, -canvas.height / 2)
    ctx.restore()
    result.push(await new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob == null) {
          throw new Error('Failed to convert canvas to blob')
        }
        resolve(blob)
      })
    }))
  }
  return result
}
