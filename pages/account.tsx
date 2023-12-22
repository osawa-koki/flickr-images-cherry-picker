import React, { useContext, useState } from 'react'
import { Form } from 'react-bootstrap'
import { FaAws, FaEye, FaRegEyeSlash } from 'react-icons/fa'
import { Context } from './_app'
import makeHelp from '../src/makeHelp'
import { emptyAccountInfoAwsS3 } from '../src/const'

export default function AccountPage (): React.JSX.Element {
  const { accountInfo, setAccountInfo } = useContext(Context)

  const [awsSecretAccessKeyIsVisible, setAwsSecretAccessKeyIsVisible] = useState(false)

  return (
    <>
      <h1>アカウント情報</h1>
      <h2 className='mt-3'>
        <FaAws className='me-3 text-primary h1' />
        AWS S3
        {makeHelp('Info about AWS S3 to store photos')}
      </h2>
      <Form.Group controlId='formBasicBucketName' className='mt-3'>
        <Form.Label>Bucket Name</Form.Label>
        <Form.Control type='text' placeholder='Enter bucket name' value={accountInfo?.aws_s3?.bucket} onInput={(event) => {
          const target = event.target as HTMLInputElement
          setAccountInfo({
            ...accountInfo,
            aws_s3: {
              ...emptyAccountInfoAwsS3,
              ...accountInfo?.aws_s3,
              bucket: target.value
            }
          })
        }} />
      </Form.Group>
      <Form.Group controlId='formBasicAccessKeyId' className='mt-3'>
        <Form.Label>Access Key ID</Form.Label>
        <Form.Control type='text' placeholder='Enter access key id' value={accountInfo?.aws_s3?.aws_access_key_id} onInput={(event) => {
          const target = event.target as HTMLInputElement
          setAccountInfo({
            ...accountInfo,
            aws_s3: {
              ...emptyAccountInfoAwsS3,
              ...accountInfo?.aws_s3,
              aws_access_key_id: target.value
            }
          })
        }} />
      </Form.Group>
      <Form.Group controlId='formBasicSecretAccessKey' className='mt-3'>
        <Form.Label>Secret Access Key</Form.Label>
        <div className='d-flex justify-content-center align-items-center'>
          {awsSecretAccessKeyIsVisible
            ? (
            <Form.Control type='text' placeholder='Enter secret access key' value={accountInfo?.aws_s3?.aws_secret_access_key} onInput={(event) => {
              const target = event.target as HTMLInputElement
              setAccountInfo({
                ...accountInfo,
                aws_s3: {
                  ...emptyAccountInfoAwsS3,
                  ...accountInfo?.aws_s3,
                  aws_secret_access_key: target.value
                }
              })
            }} />
              )
            : (
            <Form.Control type='password' value={accountInfo?.aws_s3?.aws_secret_access_key} />
              )}
          {awsSecretAccessKeyIsVisible
            ? (
            <FaRegEyeSlash role='button' className='ms-3 text-muted' onClick={() => { setAwsSecretAccessKeyIsVisible(false) }} />
              )
            : (
            <FaEye role='button' className='ms-3 text-primary' onClick={() => { setAwsSecretAccessKeyIsVisible(true) }} />
              )}
        </div>
      </Form.Group>
    </>
  )
}
