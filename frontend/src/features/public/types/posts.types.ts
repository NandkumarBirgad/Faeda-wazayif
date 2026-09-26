/**
 * features/public/types/posts.types.ts
 *
 * Domain types for Career Articles, Insights, and Community Posts.
 */

export interface PostAuthor {
  name: string
  title: string
  avatar: string
  isVerified?: boolean
  username: string
}

export interface PostComment {
  id: number
  author: string
  avatar: string
  text: string
  time: string
}

export interface PostArticle {
  id: number
  title: string
  slug: string
  summary: string
  content: string
  category: string
  tags: string[]
  coverImage: string
  publishedAt: string
  readTime: string
  views: number
  likes: number
  isLiked?: boolean
  author: PostAuthor
  comments?: PostComment[]
}

export interface PostCategory {
  name: string
  key: string
  count: number
}

export interface TrendingTopic {
  id: number
  title: string
  posts: string
  category: string
}

export interface SuggestedAuthor {
  name: string
  title: string
  avatar: string
  username: string
  articlesCount: number
  isVerified?: boolean
}

export interface PostsResponse {
  posts: PostArticle[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  categories: PostCategory[]
  trendingTopics: TrendingTopic[]
  suggestedAuthors: SuggestedAuthor[]
}

export interface PostDetailResponse {
  post: PostArticle
  related: PostArticle[]
}

export interface CreatePostDTO {
  title: string
  summary?: string
  content: string
  category: string
  coverImage?: string
  tags?: string[]
  authorName?: string
  authorTitle?: string
  authorUsername?: string
}
