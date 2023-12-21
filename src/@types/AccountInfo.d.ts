interface AccountInfoAwsS3 {
  bucket: string
  region: string
  aws_access_key_id: string
  aws_secret_access_key: string
}

interface AccountInfo {
  aws_s3: AccountInfoAwsS3
}
