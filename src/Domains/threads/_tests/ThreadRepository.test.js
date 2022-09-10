const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('should throw error when invoke unimplemented method', () => {
    const threadRepository = new ThreadRepository();

    expect(threadRepository.addThread()).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(threadRepository.getThreadById()).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(threadRepository.verifyThreadValidity()).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
