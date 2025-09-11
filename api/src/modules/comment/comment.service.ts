import { COMMENT_REPOSITORY } from '@/constants/repositories';
import { Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';

export class CommentService {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createComment({
    articleId,
    userId,
    body,
  }: {
    articleId: number;
    userId: number;
    body: string;
  }) {
    try {
      const newComment = this.commentRepository.create({
        article_id: articleId,
        author_id: userId,
        body,
      });
      return await this.commentRepository.save(newComment);
    } catch (error) {
      console.log(error);
    }
  }

  async updateComment(userId: number, commentId: number, body: string) {
    try {
      const comment = await this.commentRepository.findOneBy({
        id: commentId,
        author_id: userId,
      });
      if (!comment) {
        throw new NotFoundException(
          'Comment not found or you are not the author',
        );
      }
      return await this.commentRepository.update(commentId, { body });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteComment(userId: number, commentId: number) {
    try {
      const comment = await this.commentRepository.findOneBy({
        id: commentId,
        author_id: userId,
      });
      if (!comment) {
        throw new NotFoundException(
          'Comment not found or you are not the author',
        );
      }
      return await this.commentRepository.softDelete(commentId);
    } catch (error) {
      console.log(error);
    }
  }

  async getAllCommentByArticleId(articleId: number) {
    try {
      return await this.commentRepository.find({
        where: { article_id: articleId },
        relations: ['author'],
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getCommentById(commentId: number) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
        relations: ['author'],
      });
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }
      return comment;
    } catch (error) {
      console.log(error);
    }
  }
}
