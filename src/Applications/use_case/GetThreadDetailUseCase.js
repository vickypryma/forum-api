const DetailReply = require('../../Domains/replies/entities/DetailReply');

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(id) {
    const thread = await this._threadRepository.getThreadById(id);
    const comments = await this._commentRepository.getCommentsByThreadId(id);
    const commentIds = comments.map((comment) => comment.id);
    const commentsReplies = await this._replyRepository.getRepliesByCommentIds(commentIds);

    const commentsWithReplies = comments.map((comment) => {
      const replies = commentsReplies
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => new DetailReply(reply));
      return {
        ...comment,
        replies,
      };
    });

    return {
      ...thread,
      comments: commentsWithReplies,
    };
  }
}

module.exports = GetThreadDetailUseCase;
