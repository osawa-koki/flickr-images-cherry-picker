export default function execDownload (data: Blob, filename: string): void {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(data)
  a.download = filename
  a.click()
}
