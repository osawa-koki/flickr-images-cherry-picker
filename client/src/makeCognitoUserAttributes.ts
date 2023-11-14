import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'

/**
 * 指定したキーと値のペアから`CognitoUserAttribute`の配列を作成する。
 * @param kvp キーと値のペア
 * @returns `CognitoUserAttribute`の配列
 */
export default function makeCognitoUserAttribute (kvp: Record<string, string>): AmazonCognitoIdentity.CognitoUserAttribute[] {
  return Object.entries(kvp).map(([key, value]) => new AmazonCognitoIdentity.CognitoUserAttribute({
    Name: key,
    Value: value
  }))
}
