export interface IUser {
  id: number;
  username: string;
  email: string;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt: Date | string;
}

export interface IPost {
  id: number;
  title: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  published: boolean;
  likes: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  author?: IUser | null;
  authorId?: number;
  comments?: IComment[];
}

export interface IComment {
  id: number;
  content: string;
  createdAt: Date | string;
  author?: IUser | null;
  post?: IPost | null;
  postId?: number;
  authorId?: number;
}

export interface CreatePostDto {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
  authorId: number;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
}

export interface CreateCommentDto {
  content: string;
  postId: number;
  authorId: number;
}

export interface CreateUserDto {
  username: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
