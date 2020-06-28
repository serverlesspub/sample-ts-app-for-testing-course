import { S3Event, S3EventRecord } from 'aws-lambda'
import IFile from './IFile'

// This File Event Parser is solely responsible for handling the data structure of Amazon S3 events
// 1. Accepts an S3 event
export default function parseFileEvent(event: S3Event): IFile[] {
  // 2. Extracts S3 Records, which are basically files that the S3 event wanted to notify us about
  const s3Records: S3EventRecord[] = event.Records
  // 2. Extracts File Information of objects from S3 Records,
  //    which are defined by the bucket they belong to, the key as their identifier and their size
  const extractObject = (record: S3EventRecord): IFile => {
    const { bucket, object } = record.s3
    return { bucket: bucket.name, key: object.key }
  }
  // Goes through each S3 record and at the end returns an array of the extracted file information objects
  return s3Records.map(extractObject)
}
