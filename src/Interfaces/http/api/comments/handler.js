const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentByIdHandler = this.deleteCommentByIdHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

    const { id: userId } = request.auth.credentials;
    const { threadId } = request.params;
    const { content } = request.payload;

    const addedComment = await addCommentUseCase.execute({ content, threadId, userId });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentByIdHandler(request) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

    const { commentId, threadId } = request.params;
    const { id: userId } = request.auth.credentials;

    await deleteCommentUseCase.execute(commentId, userId, threadId);

    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
