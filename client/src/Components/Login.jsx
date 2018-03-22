import React from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
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
                type='username'
                name='username'
                className='username'
                placeholder='Enter your username'
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
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={props.handleCloseLoginModal}>Log in</Button>
          <Button color='secondary' onClick={props.handleCloseLoginModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: '',
      loginModalOpen: false,
      username: '',
      password: ''
    };

    this.handleOpenLoginModal = this.handleOpenLoginModal.bind(this);
    this.handleCloseLoginModal = this.handleCloseLoginModal.bind(this);
  }

  // express backend API example
  // componentDidMount() {
  //   this.callApi()
  //     .then(res => this.setState({ response: res.express }))
  //     .catch(err => console.log(err));
  // }
  //
  // callApi = async () => {
  //   const response = await fetch('/api/hello');
  //   const body = await response.json();
  //
  //   if (response.status !== 200) throw Error(body.message);
  //
  //   return body;
  // };

  handleOpenLoginModal () {
    this.setState({
      loginModalOpen: true
    });
  }

  handleCloseLoginModal () {
    this.setState({
      loginModalOpen: false
    });
  }

  render () {
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
              Check in
            </Button>
          </div>
        </Jumbotron>
        <LoginModal
          open={this.state.loginModalOpen}
          handleCloseLoginModal={() => this.handleCloseLoginModal()}
        />
      </div>
    );
  }
}

export default LoginPage;