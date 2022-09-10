const CommentLikeRepository = require('../CommentLikeRepository');

describe('CommentLikesRepository interface', () => {
  it('should throw error when invoke unimplemented method', () => {
    const commentLikeRepository = new CommentLikeRepository();

    expect(commentLikeRepository.verifyCommentLiked()).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(commentLikeRepository.likeComment()).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(commentLikeRepository.unlikeComment()).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
