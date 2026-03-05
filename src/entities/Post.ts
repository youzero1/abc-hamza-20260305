import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  title!: string;

  @Column({ type: 'text', nullable: false })
  content!: string;

  @Column({ nullable: true })
  excerpt!: string | null;

  @Column({ nullable: true })
  coverImage!: string | null;

  @Column({ default: false })
  published!: boolean;

  @Column({ default: 0 })
  likes!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.posts, { nullable: true })
  @JoinColumn({ name: 'authorId' })
  author!: User | null;

  @Column({ nullable: true })
  authorId!: number | null;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];
}
