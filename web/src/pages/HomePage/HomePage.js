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
