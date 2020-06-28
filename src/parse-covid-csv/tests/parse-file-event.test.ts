import parseFileEvent from '../src/parse-file-event'
import sampleEvent from '../events/event.json'

// Here we are going to be testing our event port
// These tests of our event port are responsible to ensure that the events that are coming to our
// business logic, are properly formatted and always in a structure that our business logic can handle
// As our event port is a simple function these tests are just checking that the results come in a proper format

describe('Parse File Event ', () => {
  describe('unit', () => {
    // simply we pass in an event with no records, which might happen if our there is an issue with our file storage, we want to return an empty array
    // so we aren't triggering our main business logic at all, if there is no data
    it('should return an empty array if there are no records', () => {
      expect(parseFileEvent({
        Records: [],
      })).toEqual([])
    })
    // naturally if there is a single row, give us an array with one file element
    it('should return a sample bucket and file path for a valid event with one object', () => {
      expect(parseFileEvent(sampleEvent)).toEqual([{
        bucket: 'example-bucket',
        key: 'test/key',
      }])
    })
    // Multiple events should return an array with an equal number of files
    it('should return sample buckets and file paths for multiple a valid event with multiple objects', () => {
      const testEvent = {
        ...sampleEvent,
        Records: [
          sampleEvent.Records[0],
          sampleEvent.Records[0],
        ],
      }
      expect(parseFileEvent(testEvent)).toEqual([
        {
          bucket: 'example-bucket',
          key: 'test/key',
        },
        {
          bucket: 'example-bucket',
          key: 'test/key',
        },
      ])
    })
  })
})
