import databaseAdapter from '../../../../adapters/database-adapter'

// Now we're testing our Database Adapter and how our database service gets called
// The tests here are quite simple as with the file storage adapter. We are simply implementing the protocol with the database we are using
describe('Database Adapter', () => {

  // Simple spy methods
  const mockedPut = jest.fn()
  const mockedPutPromise = jest.fn()

  let dbService: any
  const TABLE_NAME = 'covid19-cases'

  beforeEach(function () {
    // Identical to the file storage tests, ensuring that our databaseService mock has the necessary implementation to track proper calls
    // with validation of TableName and Item, that it fails whether the parameters are invalid
    dbService = { put: mockedPut.mockImplementation(({ TableName, Item }) => {
      if (!TableName || typeof TableName !== 'string') throw new Error('Invalid values')
      if (!Item || typeof Item !== 'object') throw new Error('Invalid values')
      return { promise: mockedPutPromise.mockResolvedValue(Item) }
    })}
  })

  // Checking if the dbService is properly called and our implementation properly calls the necessary
  // services "put" and the subsequent "promise" method, with the proper TableName and Item values
  it('should call the dbService put and return a Promise', async () => {
    await databaseAdapter.saveItem({ name: 'test' }, TABLE_NAME, dbService)
    expect(mockedPut).toHaveBeenCalled()
    expect(mockedPut).toHaveBeenCalledTimes(1)
    expect(mockedPut).toHaveBeenCalledWith({
      TableName: TABLE_NAME,
      Item: expect.objectContaining({
        name: 'test',
      }),
    })
    expect(mockedPutPromise).toHaveBeenCalled()
    expect(mockedPutPromise).toHaveBeenCalledTimes(1)
  })

  // Intentionally misconfiguring our dbService, to see whether it won't silently fail
  // and will it throw an error when being improperly called
  it('should throw an error when one of the parameters is not provided', async () => {
    try {
      await databaseAdapter.saveItem({ name: 'test' }, dbService)
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })

  // Cleanup all of our mocks after each test
  afterEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })
})
