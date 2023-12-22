interface SharedData {
  version: string
  date: Date
  groups: Array<{
    key: string
    photos: string[]
  }>
}
