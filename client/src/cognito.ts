import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import { CognitoIdentityServiceProvider } from 'aws-sdk'

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({ region: 'ap-northeast-1' })

const cognitoClientId = process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID
const cognitoUserPoolId = process.env.NEXT_PUBLIC_USER_POOL_ID

if (cognitoClientId == null) throw new Error('NEXT_PUBLIC_USER_POOL_CLIENT_ID is not defined.')
if (cognitoUserPoolId == null) throw new Error('NEXT_PUBLIC_USER_POOL_ID is not defined.')

const userPool = new AmazonCognitoIdentity.CognitoUserPool({
  ClientId: cognitoClientId,
  UserPoolId: cognitoUserPoolId
})

export { userPool, cognitoIdentityServiceProvider }
