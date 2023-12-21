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
    emoji: '🔍',
    path: '/search/',
    name: 'Search'
  },
  {
    emoji: '🌉',
    path: '/gallery/',
    name: 'Gallery'
  },
  {
    emoji: '👤',
    path: '/account/',
    name: 'Account'
  },
  {
    emoji: '📝',
    path: '/log/',
    name: 'Log'
  }
]

export default pages
