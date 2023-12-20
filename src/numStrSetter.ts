export default function numStrSetter (value: string, setter: (value: React.SetStateAction<string>) => void): void {
  if (value === '') {
    setter('')
    return
  }
  const num = Number(value)
  if (Number.isNaN(num)) {
    return
  }
  setter(num.toString())
}
