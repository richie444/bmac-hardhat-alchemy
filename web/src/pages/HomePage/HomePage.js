import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const HomePage = () => {
  return (
    <>
      <MetaTags
        title="Home"
        // description="Home description"
        /* you should un-comment description and add a unique description, 155 characters or less
      You can look at this documentation for best practices : https://developers.google.com/search/docs/advanced/appearance/good-titles-snippets */
      />

      <h1 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl md:text-3xl">
        RedwoodJS + Ethereum Demo
      </h1>
      <p className="mt-4">
        Only authenticated users can access the route <code>/users</code>, so
        you will be directed to log in first:
      </p>
      <p className="text-grey mt-4">
        <i>Try it now</i> 👉{' '}
        <Link className="text-blue-600" to={routes.users()}>
          /users
        </Link>
      </p>
    </>
  )
}

export default HomePage
