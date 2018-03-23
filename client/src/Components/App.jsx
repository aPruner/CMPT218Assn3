import React from 'react';
import LoginPage from './Login.jsx';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import UserCheckinPage from './UserCheckin.jsx';
import AdminLandingPage from './AdminLanding.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      loginModalOpen: false,
      loginButtonDisabled: true,
      username: '',
      password: ''
    };
  }

  handleOpenLoginModal = () => {
    this.setState({
      loginModalOpen: true
    });
  };

  handleCloseLoginModal = () => {
    this.setState({
      loginModalOpen: false
    });
  };

  handleLogin = () => {
    this.loginHelper()
      .then((res) => {
        if (res.loginSuccess) {
          this.setState({
            username: '',
            password: '',
            loggedIn: true
          }, () => {
            this.handleCloseLoginModal();
          });
        } else {
          this.setState({
            username: '',
            password: '',
            loggedIn: false
          }, () => {
            this.handleCloseLoginModal();
          });
        }
      })
      .catch((err) => console.log(err));
  };

  loginHelper = async () => {
    const response = await fetch('/logins', {
      method: 'POST',
      headers: {
        'Accept': 'application/JSON',
        'Content-Type': 'application/JSON'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    });

    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }

    return body;
  };

  handleUsernameChange = (event) => {
    let newValue = undefined;
    if (event && event.target) {
      newValue = event.target.value;
    }
    this.setState({
      username: newValue
    }, () => {
      if (this.state.username.length > 0 && this.state.password.length > 0) {
        this.setState({
          loginButtonDisabled: false
        });
      } else if (this.state.username.length === 0 && this.state.password.length === 0) {
        this.setState({
          loginButtonDisabled: true
        });
      }
    });
  };

  handlePasswordChange = (event) => {
    let newValue = undefined;
    if (event && event.target) {
      newValue = event.target.value;
    }
    this.setState({
      password: newValue
    }, () => {
      if (this.state.username.length > 0 && this.state.password.length > 0) {
        this.setState({
          loginButtonDisabled: false
        });
      } else if (this.state.username.length === 0 && this.state.password.length === 0) {
        this.setState({
          loginButtonDisabled: true
        });
      }
    });
  };

  render() {
    const RenderLoginPage = () => {
      return (
        <LoginPage
          username={this.state.username}
          password={this.state.password}
          loginModalOpen={this.state.loginModalOpen}
          loginButtonDisabled={this.state.loginButtonDisabled}
          handleUsernameChange={(event) => this.handleUsernameChange(event)}
          handlePasswordChange={(event) => this.handlePasswordChange(event)}
          handleCloseLoginModal={() => this.handleCloseLoginModal()}
          handleOpenLoginModal={() => this.handleOpenLoginModal()}
          handleLogin={() => this.handleLogin()}
        />
      );
    };

    return (
      <div>
        <Router>
          <div>
            {/*<AppNav /> goes here if implemented */}
            <div className='page-container'>
              <Route
                exact
                path='/'
                render={RenderLoginPage}
              />
              <Route path='/checkin' component={UserCheckinPage}/>
              <Route path='/admin' component={AdminLandingPage}/>
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
