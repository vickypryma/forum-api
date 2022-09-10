const DetailReply = require('../DetailReply');

describe('DetailReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-123',
      content: 'balasan',
    };

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'reply-123',
      content: 'balasan',
      date: {},
      username: true,
      is_delete: 123,
    };

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'balasan',
      date: new Date(),
      username: 'dicoding',
      is_delete: false,
    };

    const detailReply = new DetailReply(payload);

    expect(detailReply).toBeInstanceOf(DetailReply);
    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply.content).toEqual(payload.content);
    expect(detailReply.date).toEqual(payload.date);
    expect(detailReply.username).toEqual(payload.username);
  });

  it('should replace content with "**balasan telah dihapus**" when is_delete is true', () => {
    const payload = {
      id: 'reply-123',
      content: 'balasan',
      date: new Date(),
      username: 'dicoding',
      is_delete: true,
    };

    const detailReply = new DetailReply(payload);

    expect(detailReply).toBeInstanceOf(DetailReply);
    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply.content).toEqual('**balasan telah dihapus**');
    expect(detailReply.date).toEqual(payload.date);
    expect(detailReply.username).toEqual(payload.username);
  });
});
