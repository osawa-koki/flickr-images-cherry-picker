import React, { useState } from 'react'
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import { toast } from 'react-toastify'

import { userPool } from '../src/cognito'

import { type pageOptionEnum } from './Auth'
import { Alert, Button, Form } from 'react-bootstrap'

interface Props {
  setPageOption: React.Dispatch<React.SetStateAction<pageOptionEnum>>
  tmpEmail: string
}

export default function AuthConfirmRegistration (props: Props): React.JSX.Element {
  const { setPageOption, tmpEmail } = props

  const [isLoading, setIsLoading] = useState(false)

  const [email, setEmail] = useState(tmpEmail)
  const [code, setCode] = useState('')

  const confirmRegistration = async (): Promise<void> => {
    setIsLoading(true)

    const userData = {
      Username: tmpEmail,
      Pool: userPool
    }
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      try {
      // 確認がエラーとなった場合の処理
        if (err != null) {
          console.error(err.message)
          toast.error('User verify failed.')
          return
        }

        if (result == null) throw new Error('Invalid result.')

        // 確認が成功した場合の処理
        toast.success(`User ${cognitoUser.getUsername()} has verified!`)
        setPageOption('SignIn')
      } finally {
        setIsLoading(false)
      }
    })
  }

  return (
    <>
      <div id='ConfirmRegistration'>
        <h2>Confirm Registration</h2>
        <Form.Group controlId='formBasicEmail' className='mt-3'>
          <Form.Label>Email address</Form.Label>
          <Form.Control type='email' value={email} onClick={(event) => { setEmail(event.currentTarget.value) }}/>
        </Form.Group>
        <Form.Group controlId='formBasicCode' className='mt-3'>
          <Form.Label>Code</Form.Label>
          <Form.Control type='text' placeholder='Enter code' value={code} onInput={(event) => { setCode(event.currentTarget.value) }} />
        </Form.Group>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <Button variant='primary' className='mt-3' onClick={confirmRegistration} disabled={isLoading}>
          Confirm Registration
        </Button>
        <hr />
        <Alert variant='info'>
          確認コードを再送信する場合は、
          <Alert.Link onClick={() => { setPageOption('ResendCode') }}>こちら</Alert.Link>
          をクリックしてください。
        </Alert>
      </div>
    </>
  )
}
