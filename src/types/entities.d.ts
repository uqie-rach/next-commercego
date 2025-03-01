export interface User {
  name: string
  email: string
  image: string | null
  id: string
  role: 'lead' | 'core' | 'ascore'
}
