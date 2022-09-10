class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(commentId, userId, threadId) {
    await this._commentRepository.verifyCommentOwner(commentId, userId);
    await this._commentRepository.deleteCommentById(commentId, threadId);
  }
}

module.exports = DeleteCommentUseCase;
