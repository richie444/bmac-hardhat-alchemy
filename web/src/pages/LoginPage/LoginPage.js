import { useAuth } from '@redwoodjs/auth'
import { routes, navigate } from '@redwoodjs/router'
import { useParams } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { MetamaskIcon } from 'src/components/Icons'

const LoginPage = () => {
  const { logIn } = useAuth()
  const { redirectTo } = useParams()

  const onLogin = async (walletType) => {
    try {
      await logIn({ type: walletType })
      navigate(redirectTo || routes.home())
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <MetaTags
        title="Login"
        // description="Home description"
        /* you should un-comment description and add a unique description, 155 characters or less
    You can look at this documentation for best practices : https://developers.google.com/search/docs/advanced/appearance/good-titles-snippets */
      />
      <h1 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl md:text-3xl">
        Login
      </h1>
      <ul>
        <li>
          <button
            className={
              'mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md border px-4 py-2 text-base font-medium shadow-sm hover:bg-gray-300'
            }
            onClick={onLogin}
          >
            <div className="mr-4">
              <MetamaskIcon />
            </div>
            Log in with Ethereum
          </button>
        </li>
      </ul>
    </>
  )
}

export default LoginPage
