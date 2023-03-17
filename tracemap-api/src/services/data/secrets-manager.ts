import { DecryptCommand, KMSClient } from '@aws-sdk/client-kms'

const region = 'eu-central-1'

const kms = new KMSClient({ region })

/**
 * Decrypts a value using AWS KMS. The decrypted value will NOT be cached.
 */
export async function decrypt(value: string): Promise<string> {
  const response = await kms.send(
    new DecryptCommand({ CiphertextBlob: Buffer.from(value, 'base64') }),
  )

  if (!response.Plaintext) {
    throw new Error('There was an error decrypting the secret: Plaintext must not be undefined')
  }

  return new TextDecoder().decode(response.Plaintext)
}
