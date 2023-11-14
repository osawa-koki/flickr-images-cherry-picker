import React, { useState } from 'react'

export type pageOptionEnum = 'SignUp' | 'ConfirmRegistration' | 'SignIn'

export default function Auth (): React.JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageOption, setPageOption] = useState<pageOptionEnum>('SignUp')

  return (
    <>
      {((): React.JSX.Element => {
        switch (pageOption) {
          case 'SignUp':
            // return <AuthSignUp setPageOption={setPageOption} />
            return <></>
          default:
            throw new Error('Invalid pageOption.')
        }
      })()}
    </>
  )
}
