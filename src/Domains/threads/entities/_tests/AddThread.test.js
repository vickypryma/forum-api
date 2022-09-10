const AddThread = require('../AddThread');

describe('AddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'dicoding',
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      title: 'dicoding',
      body: 123,
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddThread object correctly', () => {
    const payload = {
      title: 'dicoding',
      body: 'dicoding indonesia',
    };

    const addThread = new AddThread(payload);

    expect(addThread).toBeInstanceOf(AddThread);
    expect(addThread.title).toEqual(payload.title);
    expect(addThread.body).toEqual(payload.body);
  });
});
