const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
  it('should throw error when invoke unimplemented method', () => {
    const commentRepository = new CommentRepository();

    expect(commentRepository.addComment()).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(commentRepository.getCommentsByThreadId()).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(commentRepository.deleteCommentById()).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(commentRepository.verifyCommentOwner()).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(commentRepository.verifyCommentValidity()).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
