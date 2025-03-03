export interface User {
  name: string | null
  email: string | null
  image: string | null
  id?: string
  role?: 'admin' | 'member' | null
  profile: UserProfile | null
}

export interface UserProfile {
  phone: string
  duty: 'lead' | 'core' | 'ascore'
  bio: string
  location: string
  linkedin: string
  github: string
  twitter: string
  instagram: string
  website: string
}

export interface Article {
  id: string
  title: string
  content: string
  userId: string
  createdAt?: string
  user?: User
}
