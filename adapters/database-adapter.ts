import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { v4 as uuidv4 } from 'uuid'
const documentClient = new DocumentClient()

// This Database Adapter's sole responsibility is handling the communication protocol with AWS DynamoDB
// 1. Accepts an item (JSON), tableName, to know where to store the data and 
//    as an optional parameter it accepts the database client library, where we by default set the DynamoDBs Document Client
//    In this case the reason behind it is because we want to make it easier to test and mock. 
//    This approach enables simple JavaScript objects or spy objects to be passed, without having to extensively mock the DocumentClient
export default {
  saveItem: async function saveItem(item: any, tableName: string, db = documentClient): Promise<void> {
    // 2. We generate the item ID
    item.id = uuidv4()
    try {
      // 3. Try to store the file into our current database
      await db.put({
        TableName: tableName,
        Item: item
      }).promise()
    } catch(e) {
      throw JSON.stringify({message: `Error saving ${JSON.stringify(e)}` })
    }
  }
}
