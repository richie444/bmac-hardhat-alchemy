import { useAuth } from '@redwoodjs/auth'
import { routes, navigate, Link, useParams } from '@redwoodjs/router'

import { LogoutIcon, MetamaskIcon } from 'src/components/Icons'
import Logo from 'src/components/Logo'

const truncate = (text, length = 50) => {
  if (typeof text !== 'string') return ''
  return text.substring(0, length) + '...'
}

const DefaultLayout = ({ children }) => {
  const { isAuthenticated, currentUser, logOut, logIn } = useAuth()
  const { redirectTo } = useParams()

  const onLogOut = () => {
    logOut()
    navigate(routes.home())
  }

  const onLogin = async (walletType) => {
    try {
      await logIn({ type: walletType })
      navigate(redirectTo || routes.home())
    } catch (e) {
      console.log(e)
    }
  }

  const loginButtons = isAuthenticated ? (
    <div className="flex items-center">
      <button
        onClick={() => navigate(routes.profile())}
        to="login"
        className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700"
      >
        {truncate(currentUser?.address, 7)}
      </button>
      <button className="rw-button rw-button-small ml-4" onClick={onLogOut}>
        Logout
        <div className="ml-2">
          <LogoutIcon color="#718096" />
        </div>
      </button>
    </div>
  ) : (
    <div className="justify-end">
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
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col bg-orange-200 ">
      <header className="relative bg-yellow-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between border-b-2 border-gray-100 py-3  md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link to="/">
                <Logo />
              </Link>
            </div>
            {loginButtons}
          </div>
        </div>
      </header>
      <div className="rw-main mx-auto mt-4 w-full max-w-7xl flex-grow px-4 sm:px-6">
        {children}
      </div>

      <footer>
        <div className="relative mt-8 bg-orange-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center justify-between py-6 md:justify-start md:space-x-10">
              <div className="flex justify-start  lg:w-0 lg:flex-1">
                <p className="mr-4">Copyright © {new Date().getFullYear()}</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default DefaultLayout
