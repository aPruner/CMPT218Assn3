import React from 'react';
import LoginPage from './Login.jsx';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import UserCheckinPage from './UserCheckin.jsx';
import AdminLandingPage from './AdminLanding.jsx';

class AppView extends React.Component {

  render() {
    return (
      <div>
        <Router>
          <div>
            {/*<AppNav /> goes here if implemented */}
            <div className='page-container'>
              <Route exact path='/' component={LoginPage}/>
              <Route path='/checkin' component={UserCheckinPage}/>
              <Route path='/admin' component={AdminLandingPage}/>
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default AppView;
