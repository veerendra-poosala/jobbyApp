import {Switch, Route, Redirect} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
// import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'
import NotFound from './components/NotFound'
import Jobs from './components/Jobs'
import JobItemDetails from './components/JobItemDetails'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <>
    <Switch>
      <ProtectedRoute exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route
        exact
        path="/jobs/:id"
        render={props => (
          <JobItemDetails key={props.match.params.id} {...props} />
        )}
      />
      <ProtectedRoute exact path="/jobs" component={Jobs} />
      <ProtectedRoute path="/not-found" component={NotFound} />
      <Redirect to="/not-found" />
    </Switch>
  </>
)

export default App
