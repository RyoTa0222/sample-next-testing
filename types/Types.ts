export interface POST {
  id: number
  title: string
  body: string
  userId: number
}

export interface COMMENT {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

export interface TASK {
  userId: number
  id: number
  title: string
  completed: boolean
}
