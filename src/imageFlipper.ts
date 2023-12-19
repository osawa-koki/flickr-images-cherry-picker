export default async function imageFlipper (image: Blob): Promise<Blob> {
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
  ctx.translate(canvas.width, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(canvasImgSrc, 0, 0)
  return await new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob != null) {
        resolve(blob)
      } else {
        reject(new Error('Failed to flip image'))
      }
    })
  })
}
