class LikeCommentUseCase {
  constructor({ commentRepository, commentLikeRepository }) {
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(commentId, threadId, userId) {
    await this._commentRepository.verifyCommentValidity(commentId, threadId);
    const isLiked = await this._commentLikeRepository.verifyCommentLiked(commentId, userId);

    if (isLiked) {
      await this._commentLikeRepository.unlikeComment(commentId, userId);
    } else {
      await this._commentLikeRepository.likeComment(commentId, userId);
    }
  }
}

module.exports = LikeCommentUseCase;
