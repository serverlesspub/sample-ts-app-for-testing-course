// Allow CloudWatch to read source maps
import 'source-map-support/register'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { S3Event, S3EventRecord } from 'aws-lambda'
import S3 from 'aws-sdk/clients/s3'
import path from 'path'
import os from 'os'
import util from 'util'
import * as stream from 'stream'
import * as fs from 'fs'
import neatCsv from 'neat-csv'
import { v4 as uuidv4 } from 'uuid'
const pipeline = util.promisify(stream.pipeline)
const TABLE_NAME = process.env.TABLE_NAME || ''
const documentClient = new DocumentClient()
const s3 = new S3()
export async function handler(event: S3Event): Promise<any> {
  const s3Records = event.Records
  await Promise.all(s3Records.map(async (record: S3EventRecord) => processCSV(record)))
}
async function processCSV(record: S3EventRecord): Promise<any> {
  const downloadPath = path.join(os.tmpdir(), record.s3.object.key)
  try {
    const readable = s3.getObject({
      Bucket: record.s3.bucket.name,
      Key: record.s3.object.key,
    }).createReadStream()
    const writable = fs.createWriteStream(downloadPath, { encoding: 'utf8' })
    await pipeline(
      readable,
      writable
    )
  } catch (e) {
    console.log(e)
    throw e
  }
  const readCsv = fs.createReadStream(downloadPath)
  const jsonData = await neatCsv(readCsv)
  await Promise.all(jsonData.map(async (entry: any) => {
    entry.id = uuidv4()
    try {
      return await documentClient.put({
        TableName: TABLE_NAME,
        Item: entry,
      }).promise()
    } catch (e) {
      console.error(e)
      throw e
    }
  }))
}
