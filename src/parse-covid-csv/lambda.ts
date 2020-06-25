// Allow CloudWatch to read source maps
import 'source-map-support/register'
import AWSXRay from 'aws-xray-sdk-core'
import { S3Event } from 'aws-lambda'
import https from 'https'

// Instead of keeping all of our logic in one file,
// it is much easier to handle the logic by storing it the /src folder
import processCSV from './src/main'

if (process.env.AWS_EXECUTION_ENV) {
  AWSXRay.captureHTTPsGlobal(https, true)
}

// Here we are introducing a File Event Port, per Hexagonal architecture principles
import parseFileEvent from './src/parse-file-event'

// Since we are going to reference a File structure, { key, bucket }, quite a lot,
// it is much better to define a proper interface than to rely on "any" a type
import IFile from './src/IFile'

const TABLE_NAME = process.env.TABLE_NAME || ''

export async function handler(event: S3Event): Promise<any> {

  // With it we are parsing an external event to a format more suitable for our business logic
  const receivedFiles: IFile[] = parseFileEvent(event)

  // Simply, we are going through all event Files,
  // and passing them to our main business logic for processing
  return await Promise.all(receivedFiles.map(async (file: IFile) => processCSV(file, TABLE_NAME)))
}
