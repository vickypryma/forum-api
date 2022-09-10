const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    const expectedThreadDetail = {
      id: 'thread-123',
      title: 'dicoding',
      body: 'dicoding indonesia',
      date: new Date('2022-09-02 12:00'),
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          content: 'ini komentar',
          date: new Date('2022-09-02 12:00'),
          username: 'vicky',
          likeCount: 1,
          replies: [
            new DetailReply({
              id: 'reply-123',
              content: 'ini balasan',
              date: new Date('2022-09-02 12:00'),
              username: 'vicky',
              is_delete: false,
            }),
          ],
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(new DetailThread({
        id: 'thread-123',
        title: 'dicoding',
        body: 'dicoding indonesia',
        date: new Date('2022-09-02 12:00'),
        username: 'dicoding',
      })));

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        new DetailComment({
          id: 'comment-123',
          content: 'ini komentar',
          date: new Date('2022-09-02 12:00'),
          username: 'vicky',
          is_delete: false,
          like_count: '1',
        }),
      ]));

    mockReplyRepository.getRepliesByCommentIds = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'reply-123',
          content: 'ini balasan',
          comment_id: 'comment-123',
          owner: 'user-123',
          is_delete: false,
          date: new Date('2022-09-02 12:00'),
          username: 'vicky',
        },
      ]));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const thread = await getThreadDetailUseCase.execute('thread-123');

    expect(thread).toStrictEqual(expectedThreadDetail);
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith('thread-123');
    expect(mockReplyRepository.getRepliesByCommentIds).toBeCalledWith(['comment-123']);
  });
});
