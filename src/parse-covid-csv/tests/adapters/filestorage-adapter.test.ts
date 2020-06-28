import fileStorageAdapter from '../../../../adapters/filestorage-adapter'

// Now we're testing our File Storage Adapter and how our external file storage service gets called
// depending on the data received. The tests here are quite simple, as we just implementing the protocol with the storage service
describe('File Storage Adapter', () => {

  // Simple spy methods
  const mockedS3GetObject = jest.fn()
  const mockedCreateReadStream = jest.fn()

  let storageService: any

  beforeEach(function () {
    // We are ensuring that our storageService mock has the necessary implementation to track proper calls
    // and as you can see with the validation of Bucket and Key, that it fails whether the parameters are invalid
    storageService = { getObject: mockedS3GetObject.mockImplementation(({ Bucket, Key }) => {
      if (!Bucket || typeof Bucket !== 'string') throw new Error('Invalid Bucket value')
      if (!Key || typeof Key !== 'string') throw new Error('Invalid Key value')
      if (!Bucket || !Key) throw new Error('No bucket or key')
      return { createReadStream: mockedCreateReadStream.mockResolvedValue(true) }
    })}
  })

  // We are checking if our storageService is properly called and that our implementation properly calls the necessary
  // services, with the proper Bucket and Key values
  it('should call the S3 GetObject and createReadStream', async () => {
    await fileStorageAdapter.getFileStream('test/key', 'example-bucket', storageService)
    expect(mockedS3GetObject).toHaveBeenCalled()
    expect(mockedS3GetObject).toHaveBeenCalledTimes(1)
    expect(mockedS3GetObject).toHaveBeenCalledWith({
      Key: 'test/key',
      Bucket: 'example-bucket',
    })
    expect(mockedCreateReadStream).toHaveBeenCalled()
    expect(mockedCreateReadStream).toHaveBeenCalledTimes(1)
  })

  // Here we're intentionally misconfiguring our storage service, to see whether it won't silently fail
  // and will it throw an error when being improperly called
  it('should throw an error when one of the parameters is invalid or not provided', async () => {
    try {
      await fileStorageAdapter.getFileStream('example-bucket', storageService)
    } catch (e) {
      expect(e).toBeInstanceOf(TypeError)
    }
  })

  // Cleanup all of our mocks after each test
  afterEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })
})
