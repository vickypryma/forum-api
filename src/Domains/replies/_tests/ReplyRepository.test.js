const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository interface', () => {
  it('should throw error when invoke unimplemented method', () => {
    const replyRepository = new ReplyRepository();

    expect(replyRepository.addReply()).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(replyRepository.getRepliesByCommentId()).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(replyRepository.getRepliesByCommentIds()).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(replyRepository.deleteReplyById()).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(replyRepository.verifyReplyOwner()).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
