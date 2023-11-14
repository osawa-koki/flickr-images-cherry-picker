import React, { useState } from 'react'

import AuthSignUp from './AuthSignUp'

export type pageOptionEnum = 'SignUp' | 'ConfirmRegistration' | 'SignIn'

export default function Auth (): React.JSX.Element {
  const [pageOption, setPageOption] = useState<pageOptionEnum>('SignUp')

  return (
    <>
      {((): React.JSX.Element => {
        switch (pageOption) {
          case 'SignUp':
            return <AuthSignUp setPageOption={setPageOption} />
          default:
            throw new Error('Invalid pageOption.')
        }
      })()}
    </>
  )
}
