const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class CommentLikesHandler {
  constructor(container) {
    this._container = container;

    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
  }

  async putCommentLikeHandler(request) {
    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);

    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    await likeCommentUseCase.execute(commentId, threadId, userId);

    return {
      status: 'success',
    };
  }
}

module.exports = CommentLikesHandler;
