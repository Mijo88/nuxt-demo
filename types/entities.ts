export {}

declare global {
  namespace TG {
    type TodoEntity = {
      userId: number
      id: number
      title: string
      completed: boolean
    }

    type PostEntity = {
      userId: number
      id: number
      title: string
      body: string
    }

    type CommentEntity = {
      postId: number
      id: number
      name: string
      email: string
      body: string
    }
  }
}
