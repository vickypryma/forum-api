const DetailComment = require('../DetailComment');

describe('DetailComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      content: 'komentar',
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data specification', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: 123,
      content: 'komentar',
      is_delete: 'true',
      like_count: '0',
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: new Date(),
      content: 'komentar',
      is_delete: false,
      like_count: '1',
    };

    const detailComment = new DetailComment(payload);

    expect(detailComment).toBeInstanceOf(DetailComment);
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual(payload.content);
    expect(detailComment.likeCount).toEqual(1);
  });

  it('should replace content with "**komentar telah dihapus**" when is_delete is true', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: new Date(),
      content: 'komentar',
      is_delete: true,
      like_count: '2',
    };

    const detailComment = new DetailComment(payload);

    expect(detailComment).toBeInstanceOf(DetailComment);
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual('**komentar telah dihapus**');
    expect(detailComment.likeCount).toEqual(2);
  });
});
