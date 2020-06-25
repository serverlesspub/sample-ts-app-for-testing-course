import IFile from './IFile'

// Importing the adapters to other external services we are using
// *** Note! Take a look at the adapter file names, we aren't referencing S3 or DynamoDB anywhere
import fileStorageAdapter from '../../../adapters/filestorage-adapter'
import databaseAdapter from '../../../adapters/database-adapter'

// This is the NPM library we are going to use to parse a CSV file into a JSON structure
import neatCsv from 'neat-csv'

// This file represents our main business logic where it needs to
// get and process a CSV file and store its data into a database
// Take a note of the parameters passed:
// 1. storedFile - representing the file location info (where its stored and by which key)
// 2. tableName - what is the name of the database table  where we want to store the file contents

// Now, particularly these are the more important for us:
// 3. fileAdapter - the adapter responsible(!) for the implementation protocol with our current file storage service
// 4. dbAdapter - the adapter responsible(!) for the implementation protocol with our current database service
//
//  Note!
//    The reason for setting these adapters as optional paramters and also defining their default values is
//    because then we can easily override the parameters with another of our choosing.
//    Making it easier to:
//     - Migrate to another database or fileStorage service. Say we run a Lambda and want to use Azure CosmosDB,
//       just change the implementation of the dbAdapter
//     - Ease mocking when testing. Just call the "processCSV" function with simple JavaScript objects, or spy objects.


// Now to explain the core business logic within
export default async function processCSV(storedFile: IFile, tableName: string, fileAdapter = fileStorageAdapter, dbAdapter = databaseAdapter): Promise<any> {
  const { key, bucket } = storedFile

  // 1. Retrieving a File from its Storage
  const fileStream = await fileAdapter.getFileStream(key, bucket)

  // 2. Invoking the CSV library and parsing it to JSON.
  //    The "jsonData" is now an Array of JSON objects, each JSON object is one CSV row
  const jsonData = await neatCsv(fileStream)

  // 3. Going over each parsed CSV row (which is now in the JSON format)
  //    And calling the dbAdapter to store it.
  return await Promise.all(jsonData.map(async (entry: any) => await dbAdapter.saveItem(entry, tableName)))
}
