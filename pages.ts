interface Page {
  emoji: string
  path: string
  name: string
}

const pages: Page[] = [
  {
    emoji: '🏠',
    path: '/',
    name: 'Home'
  },
  {
    emoji: '📷',
    path: '/gallery/',
    name: 'Gallery'
  }
]

export default pages
