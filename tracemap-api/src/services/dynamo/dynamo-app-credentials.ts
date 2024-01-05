import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'

const tableName = 'mastodon-apps'

const bareClient = new DynamoDBClient({ region: 'eu-central-1' })
const ddb = DynamoDBDocumentClient.from(bareClient)

interface AppCredentials {
  client_id: string
  client_secret: string
}

export async function getAppCredentialsFromDynamo(server: string) {
  const { Item } = await ddb.send(
    new GetCommand({ TableName: tableName, Key: { serverName: server } }),
  )

  return Item as AppCredentials | undefined
}

export async function saveAppCredentialsToDynamo(server: string, credentials: AppCredentials) {
  const { client_id, client_secret } = credentials
  return await ddb.send(
    new PutCommand({
      TableName: tableName,
      Item: { serverName: server, client_id, client_secret },
    }),
  )
}
