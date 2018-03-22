import React from 'react';
import LoginPage from './Login.jsx';
import { BrowserRouter as Router, Route } from 'react-router-dom';

class AppView extends React.Component {

  render() {
    return (
      <div>
        <Router>
          <div>
            {/*<AppNav /> */}
            <div className='page-container'>
              <Route exact path='/' component={LoginPage}/>
              <Route path='checkin' />
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default AppView;
