import { Set, Router, Route, Private } from '@redwoodjs/router'

import DefaultLayout from 'src/layouts/DefaultLayout'

import Loader from './components/Loader/Loader'

const Routes = () => {
  return (
    <Router>
      <Set wrap={DefaultLayout} whileLoadingPage={Loader}>
        <Route path="/" page={HomePage} name="home" />
        <Private unauthenticated="home">
          <Route path="/users" page={UserUsersPage} name="users" />
          <Route path="/users/{id}" page={UserUserPage} name="user" />
        </Private>
        <Route notfound page={NotFoundPage} />
      </Set>
    </Router>
  )
}

export default Routes
