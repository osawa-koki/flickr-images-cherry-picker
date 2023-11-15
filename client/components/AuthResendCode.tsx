import React, { useState } from 'react'
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import { toast } from 'react-toastify'

import { userPool } from '../src/cognito'

import { type pageOptionEnum } from './Auth'
import { Alert, Button, Form } from 'react-bootstrap'

interface Props {
  setPageOption: React.Dispatch<React.SetStateAction<pageOptionEnum>>
  setTmpEmail: React.Dispatch<React.SetStateAction<string>>
}

export default function AuthResendCode (props: Props): React.JSX.Element {
  const { setPageOption, setTmpEmail } = props

  const [isLoading, setIsLoading] = useState(false)

  const [email, setEmail] = useState('')

  const resendCode = async (): Promise<void> => {
    setIsLoading(true)

    const userData = {
      Username: email,
      Pool: userPool
    }
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)

    cognitoUser.resendConfirmationCode((err, result) => {
      try {
        // 再送信がエラーとなった場合の処理
        if (err != null) {
          console.error(err.message)
          toast.error('Resend code failed.')
          return
        }

        if (result == null) throw new Error('Invalid result.')

        // 再送信が成功した場合の処理
        toast.success(`Resend code to ${cognitoUser.getUsername()}!`)
        setTmpEmail(email)
        setPageOption('ConfirmRegistration')
      } finally {
        setIsLoading(false)
      }
    })
  }

  return (
    <>
      <div id='ResendCode'>
        <h2>Resend Code</h2>
        <Form.Group controlId='formBasicEmail' className='mt-3'>
          <Form.Label>Email address</Form.Label>
          <Form.Control type='email' value={email} onInput={(event) => { setEmail(event.currentTarget.value) } }/>
        </Form.Group>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <Button variant='primary' className='mt-3' onClick={resendCode} disabled={isLoading}>
          Resend Code
        </Button>
        <hr />
        <Alert variant='info'>
          アカウントをお持ちの方は、<Alert.Link onClick={() => { setPageOption('SignIn') }}>サインイン</Alert.Link>してください。
        </Alert>
      </div>
    </>
  )
}
