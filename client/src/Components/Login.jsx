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
          <Link to='/admin'>
            <Button
              color='primary'
              disabled={props.loginButtonDisabled}
              onClick={props.handleLogin}
            >
              Log in
            </Button>
          </Link>
          <Button
            color='secondary'
            onClick={props.handleCloseLoginModal}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

function LoginPage(props) {

  return (
    <div className='login-page'>
      <Jumbotron className='login-jumbotron'>
        <h1 className='display-5'>Welcome to CMPT 218 Assignment 3!</h1>
        <hr className='my-2' />
        <p className='lead'>Click a button below to get started</p>
        <div>
          <Button
            color='primary'
            onClick={props.handleOpenLoginModal}
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
        open={props.loginModalOpen}
        username={props.username}
        password={props.password}
        loginButtonDisabled={props.loginButtonDisabled}
        handleCloseLoginModal={() => props.handleCloseLoginModal()}
        handleUsernameChange={(event) => props.handleUsernameChange(event)}
        handlePasswordChange={(event) => props.handlePasswordChange(event)}
        handleLogin={() => props.handleLogin()}
      />
    </div>
  );
}

export default LoginPage;