const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'dicoding',
      body: 'dicoding indonesia',
    };
    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'dicoding',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedThread({
        id: 'thread-123',
        title: 'dicoding',
        owner: 'user-123',
      })));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await addThreadUseCase.execute(useCasePayload, 'user-123');

    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      title: 'dicoding',
      body: 'dicoding indonesia',
    }), 'user-123');
  });
});
