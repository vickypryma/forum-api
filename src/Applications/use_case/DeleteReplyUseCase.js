class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
  }

  async execute(replyId, commentId, threadId, userId) {
    await this._commentRepository.verifyCommentValidity(commentId, threadId);
    await this._replyRepository.verifyReplyOwner(replyId, userId);
    await this._replyRepository.deleteReplyById(replyId, commentId);
  }
}

module.exports = DeleteReplyUseCase;
