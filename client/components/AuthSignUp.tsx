import React, { useState } from 'react'
import { toast } from 'react-toastify'

import { userPool } from '../src/cognito'
import makeCognitoUserAttributes from '../src/makeCognitoUserAttributes'

import { type pageOptionEnum } from './Auth'
import { Alert, Button, Form } from 'react-bootstrap'

interface Props {
  setPageOption: React.Dispatch<React.SetStateAction<pageOptionEnum>>
  setTmpEmail: React.Dispatch<React.SetStateAction<string>>
}

export default function AuthSignUp (props: Props): React.JSX.Element {
  const { setPageOption, setTmpEmail } = props

  const gotoSignIn = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    event.preventDefault()
    setPageOption('SignIn')
  }

  const [isLoading, setIsLoading] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signUp = async (): Promise<void> => {
    setIsLoading(true)

    const attributeList = makeCognitoUserAttributes({ name, email })

    userPool.signUp(
      email,
      password,
      attributeList,
      attributeList,
      (err, result) => {
        try {
          // 登録がエラーとなった場合の処理
          if (err != null) {
            console.error(err.message)
            toast.error(
              <>
                <span className='font-monospace fw-bold'>User registration failed.</span>
                <br />
                {err.message}
              </>
            )
            return
          }

          if (result == null) throw new Error('Invalid result.')

          // 登録が成功した場合の処理
          const cognitoUser = result.user
          toast.success(`User ${cognitoUser.getUsername()} has signed up!`)
          setTmpEmail(email)
          setPageOption('ConfirmRegistration')
        } finally {
          setIsLoading(false)
        }
      }
    )
  }

  return (
    <>
      <div id='SignUp'>
        <h2>Sign Up</h2>
        <Form.Group controlId='formBasicName' className='mt-3'>
          <Form.Label>Your name</Form.Label>
          <Form.Control type='text' placeholder='Enter name' value={name} onInput={(event) => { setName(event.currentTarget.value) }} />
        </Form.Group>
        <Form.Group controlId='formBasicEmail' className='mt-3'>
          <Form.Label>Email address</Form.Label>
          <Form.Control type='email' placeholder='Enter email' value={email} onInput={(event) => { setEmail(event.currentTarget.value) }} />
        </Form.Group>
        <Form.Group controlId='formBasicPassword' className='mt-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' placeholder='Enter password' value={password} onInput={(event) => { setPassword(event.currentTarget.value) }} />
        </Form.Group>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <Button variant='primary' className='mt-3' onClick={signUp} disabled={isLoading}>
          Sign Up
        </Button>
        <hr />
        <Alert variant='info' className='mt-3'>
          サインインは<Alert.Link onClick={gotoSignIn} role='button'>こちら</Alert.Link>。
          <hr />
          確認コードを入力する場合は、<Alert.Link onClick={() => { setPageOption('ConfirmRegistration') }}>こちら</Alert.Link>。
          <hr />
          確認コードを再送信する場合は、<Alert.Link onClick={() => { setPageOption('ResendCode') }}>こちら</Alert.Link>。
        </Alert>
      </div>
    </>
  )
}
