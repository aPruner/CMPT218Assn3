import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Jumbotron,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import '../Stylesheets/Login.css';

function LoginModal(props) {

  return (
    <div>
      <Modal isOpen={props.open}>
        <ModalHeader>Log in</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for='username'>
                Username:
              </Label>
              <Input
                type='text'
                name='username'
                className='username'
                placeholder='Enter your username'
                onChange={props.handleUsernameChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for='password'>
                Password:
              </Label>
              <Input
                type='password'
                name='password'
                className='password'
                placeholder='Enter your password'
                onChange={props.handlePasswordChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' disabled={props.loginButtonDisabled} onClick={props.handleLogin}>Log in</Button>
          <Button color='secondary' onClick={props.handleCloseLoginModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModalOpen: false,
      loginButtonDisabled: true,
      loggedIn: false,
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

  handleLogin = () => {
    this.loginHelper()
      .then((res) => {
        if (res.loginSuccess) {
          this.setState({
            loggedIn: true
          }, () => {
            this.handleCloseLoginModal();
          });
        } else {
          this.setState({
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

  render() {
    return (
      <div className='login-page'>
        <Jumbotron className='login-jumbotron'>
          <h1 className='display-5'>Welcome to CMPT 218 Assignment 3!</h1>
          <hr className='my-2' />
          <p className='lead'>Click a button below to get started</p>
          <div>
            <Button
              color='primary'
              onClick={this.handleOpenLoginModal}
            >
              Log in (Admin)
            </Button>
            <Button
              color='primary'
              className='checkin-button'
            >
              <Link to='/checkin' className='button-link'>
                Check in
              </Link>
            </Button>
          </div>
        </Jumbotron>
        <LoginModal
          open={this.state.loginModalOpen}
          username={this.state.username}
          password={this.state.password}
          handleCloseLoginModal={() => this.handleCloseLoginModal()}
          handleUsernameChange={(event) => this.handleUsernameChange(event)}
          handlePasswordChange={(event) => this.handlePasswordChange(event)}
          handleLogin={() => this.handleLogin()}
          loginButtonDisabled={this.state.loginButtonDisabled}
        />
      </div>
    );
  }
}

export default LoginPage;