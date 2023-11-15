import React, { useContext, useState } from 'react'
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import { toast } from 'react-toastify'
import { Alert, Button, Form } from 'react-bootstrap'

import { userPool } from '../src/cognito'

import { type pageOptionEnum } from './Auth'
import { CognitoUserContext } from '../pages/_app'

interface Props {
  setPageOption: React.Dispatch<React.SetStateAction<pageOptionEnum>>
  tmpEmail: string
}

export default function AuthSignIn (props: Props): React.JSX.Element {
  const { setPageOption, tmpEmail } = props

  const { setAccessToken } = useContext(CognitoUserContext)

  const [isLoading, setIsLoading] = useState(false)

  const [email, setEmail] = useState(tmpEmail)
  const [password, setPassword] = useState('')

  const signUp = async (): Promise<void> => {
    setIsLoading(true)

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: email,
      Password: password
    })

    const userData = {
      Username: email,
      Pool: userPool
    }
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log(JSON.stringify(result, null, 2))
        const accessToken = result.getAccessToken().getJwtToken()
        setAccessToken(accessToken)
        toast.success(`User ${result.getIdToken().payload.email as string} has signed in!`)
        setIsLoading(false)
      },
      onFailure: (err) => {
        console.error(err.message)
        toast.error('User sign in failed.')
        setIsLoading(false)
      }
    })
  }

  return (
    <>
      <div id='SignIn'>
        <h2>Sign In</h2>
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
          Sign In
        </Button>
        <hr />
        <Alert variant='info' className='mt-3'>
          サインアップは<Alert.Link onClick={() => { setPageOption('SignUp') }} role='button'>こちら</Alert.Link>。
          <hr />
          確認コードを入力する場合は、<Alert.Link onClick={() => { setPageOption('ConfirmRegistration') }}>こちら</Alert.Link>。
          <hr />
          パスワードを忘れた場合は、<Alert.Link onClick={() => { setPageOption('ForgotPassword') }}>こちら</Alert.Link>。
        </Alert>
      </div>
    </>
  )
}
