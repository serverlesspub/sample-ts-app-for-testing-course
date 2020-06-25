import { Readable } from 'stream'
import S3 from 'aws-sdk/clients/s3'
const s3 = new S3()

// This File Storage Adapter's sole responsibility is handling the communication protocol with AWS S3
// 1. Accepts a file key (identifier), the bucket where its stored, and
//    as an optional parameter it accepts the file storage client library, where we by default set the AWS S3 client instance
//    As with the database adapter, in this case the reason behind it is because we want to make it easier to test and mock.
//    This approach enables simple JavaScript objects or spy objects to be passed, without having to extensively mock the S3 Client library
export default {
  getFileStream: async function getFileStream(key: string, bucket: string, filestorageLibrary = s3): Promise<Readable> {
    console.log('getting file stream', bucket, key)
    // 2. We simply call the file storage library to get us the object based on its file information details 
    return filestorageLibrary.getObject({
      Bucket: bucket,
      Key: key
    }).createReadStream()
    // We return the File Read Stream, as we don't have to download the file, but by passing the stream we can just attach it to our csv parser library
  }
} 
