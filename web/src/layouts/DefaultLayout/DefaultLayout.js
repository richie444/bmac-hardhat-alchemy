import { useAuth } from '@redwoodjs/auth'
import { routes, navigate, Link } from '@redwoodjs/router'

import { LogoutIcon } from 'src/components/Icons'
import Logo from 'src/components/Logo'

const truncate = (text, length = 50) => {
  if (typeof text !== 'string') return ''
  return text.substring(0, length) + '...'
}

const DefaultLayout = ({ children }) => {
  const { isAuthenticated, currentUser, logOut } = useAuth()

  const onLogOut = () => {
    logOut()
    navigate(routes.home())
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
        onClick={() => navigate(routes.login())}
        to="login"
        className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700"
      >
        Log in
      </button>
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <header className="relative bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between border-b-2 border-gray-100 py-6  md:space-x-10">
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
        <div className="relative mt-8 bg-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center justify-between py-6 md:justify-start md:space-x-10">
              <div className="flex justify-start  lg:w-0 lg:flex-1">
                <p className="mr-4">
                  © {new Date().getFullYear()} RedwoodJS + Ethereum Template
                  [WEB 3]
                </p>
                <p>
                  Made with{' '}
                  <a
                    className="text-blue-600"
                    target="_blank"
                    href="https://redwoodjs.com"
                    rel="noreferrer"
                  >
                    RedwoodJS
                  </a>
                  {' & '}
                  <a
                    className="text-blue-600"
                    target="_blank"
                    href="https://github.com/oneclickdapp/ethereum-auth"
                    rel="noreferrer"
                  >
                    @oneclickdapp/ethereum-auth
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default DefaultLayout
