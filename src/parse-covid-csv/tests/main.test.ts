import processCSV from '../src/main'
import IFile from '../src/IFile'

// This is where we start! Our main business logic file.
// You will immediately notice how easier is it to write and read these tests.
// It is enough to create the simplest mock objects for the fileAdapter and dbAdapter
// and pass them as the optional parameters, easily replacing the default values.
// The Hexagonal Architecture benefits for testing of the main business are:
//   -  Separation of concerns, single responsibility principle
//   -  Easier testing of our main business logic, without directly testing the file storage and database logic and their inherent complexities
//   -  Less risk, regardless of the adapters, we can be even more certain that our main business logic hasn't failed

describe('Process CSV', () => {

  const mockGetFileStream = jest.fn()
  const mockSaveItem = jest.fn()

  let fileAdapter: any
  let dbAdapter: any

  const TABLE_NAME = 'covid19-cases'

  // This is where we setup our mocks, as you can see a lot less complex than the previous ones
  beforeEach(function () {
    fileAdapter = { getFileStream: mockGetFileStream.mockResolvedValue('hello, name\n1,2\n') }
    dbAdapter = { saveItem: mockSaveItem.mockResolvedValue('hello, name\n1,2\n') }
  })

  // an identical test from the previous solution
  it('should parse a single CSV file and store a single row data into a database fileAdapter', async () => {
    await processCSV({ key: 'some/key', bucket: 'some-bucket' }, TABLE_NAME, fileAdapter, dbAdapter)
    expect(mockGetFileStream).toHaveBeenCalled()
    expect(mockSaveItem).toHaveBeenCalled()
    expect(mockSaveItem).toHaveBeenCalledTimes(1)
  })

  // Identical test from before. Testing whether the save items is called as many times as there are rows in the CSV file
  it('should parse a single CSV file with multiple rows and store the rows data into a database', async () => {
    fileAdapter = { getFileStream: mockGetFileStream.mockResolvedValue('hello, name\n1,2\n3,4\n5,6\n') }
    await processCSV({ key: 'some/key', bucket: 'some-bucket' }, TABLE_NAME, fileAdapter, dbAdapter)
    expect(mockGetFileStream).toHaveBeenCalled()
    expect(mockSaveItem).toHaveBeenCalled()
    expect(mockSaveItem).toHaveBeenCalledTimes(3)
  })


  // As from before, not storing any times if the file is empty
  it('should parse a single empty CSV file, without storing the CSV data into the database', async () => {
    fileAdapter = { getFileStream: mockGetFileStream.mockResolvedValue('hello, name\n') }
    await processCSV({ key: 'some/key', bucket: 'some-bucket' }, TABLE_NAME, fileAdapter, dbAdapter)
    expect(mockGetFileStream).toHaveBeenCalled()
    expect(mockSaveItem).not.toHaveBeenCalled()
  })

  // Checking is our main business logic behaving properly when there are multiple files
  it('should parse multiple CSV files, and storing all the data into the database', async () => {
    fileAdapter = { getFileStream: mockGetFileStream.mockResolvedValue('hello, name\n1,2\n3,4\n') }
    const mockFiles = [
      { key: 'some/key1', bucket: 'some-bucket' },
      { key: 'some/key2', bucket: 'some-bucket' },
      { key: 'some/key3', bucket: 'some-bucket' },
    ]
    await Promise.all(mockFiles.map(async (file: IFile) => processCSV(file, TABLE_NAME, fileAdapter, dbAdapter)))
    expect(mockGetFileStream).toHaveBeenCalled()
    expect(mockGetFileStream).toHaveBeenCalledTimes(3)
    expect(mockSaveItem).toHaveBeenCalled()
    expect(mockSaveItem).toHaveBeenCalledTimes(6)
  })

  // Cleaning up our mocks after each test to ensure
  afterEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })
})
