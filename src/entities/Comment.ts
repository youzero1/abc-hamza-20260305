import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', nullable: false })
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  @JoinColumn({ name: 'postId' })
  post!: Post;

  @Column({ nullable: true })
  postId!: number;

  @ManyToOne(() => User, (user) => user.comments, { nullable: true })
  @JoinColumn({ name: 'authorId' })
  author!: User | null;

  @Column({ nullable: true })
  authorId!: number | null;
}
