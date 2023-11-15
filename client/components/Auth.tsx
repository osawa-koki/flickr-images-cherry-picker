import React, { useState } from 'react'

import AuthSignUp from './AuthSignUp'
import AuthConfirmRegistration from './AuthConfirmRegistration'
import AuthResendCode from './AuthResendCode'
import AuthSignIn from './AuthSignIn'

export type pageOptionEnum = 'SignUp' | 'ConfirmRegistration' | 'ResendCode' | 'SignIn' | 'ForgotPassword'

export default function Auth (): React.JSX.Element {
  const [pageOption, setPageOption] = useState<pageOptionEnum>('SignUp')

  const [tmpEmail, setTmpEmail] = useState('')

  return (
    <>
      {((): React.JSX.Element => {
        switch (pageOption) {
          case 'SignUp':
            return <AuthSignUp setPageOption={setPageOption} setTmpEmail={setTmpEmail} />
          case 'ConfirmRegistration':
            return <AuthConfirmRegistration setPageOption={setPageOption} tmpEmail={tmpEmail} />
          case 'ResendCode':
            return <AuthResendCode setPageOption={setPageOption} setTmpEmail={setTmpEmail} />
          case 'SignIn':
            return <AuthSignIn setPageOption={setPageOption} tmpEmail={tmpEmail} />
          default:
            throw new Error('Invalid pageOption.')
        }
      })()}
    </>
  )
}
