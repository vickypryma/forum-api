const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyByIdHandler = this.deleteReplyByIdHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);

    const { commentId, threadId } = request.params;
    const { id: userId } = request.auth.credentials;
    const { content } = request.payload;

    const addedReply = await addReplyUseCase.execute({
      content,
      commentId,
      threadId,
      userId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyByIdHandler(request) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);

    const { replyId, commentId, threadId } = request.params;
    const { id: userId } = request.auth.credentials;

    await deleteReplyUseCase.execute(replyId, commentId, threadId, userId);
    return {
      status: 'success',
    };
  }
}

module.exports = RepliesHandler;
