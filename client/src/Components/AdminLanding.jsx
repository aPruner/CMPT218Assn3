import React from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container
} from 'reactstrap';
import '../Stylesheets/AdminLanding.css';

function AdminCheckinForm(props) {
  return (
    <Container className='admin-landing-container'>
      <h1 className='display-5'>Welcome, (Username) !</h1>
      <hr className='my-2' />
      <Form>
        <FormGroup>
          <Label for='checkinId'>
            Course id:
          </Label>
          <Input
            type='checkinId'
            name='checkinId'
            className='checkinId'
            placeholder='Enter your course id'
          />
        </FormGroup>
      </Form>
      <Button
        color='primary'
        onClick={props.handleCheckIn}
      >
        Check in
      </Button>
      <Button
        color='primary'
        className='view-history-button'
      >
        View history
      </Button>
    </Container>
  );
}

function AdminCheckoutForm(props) {
  return (
    <Container className='admin-landing-container'>
      <h1 className='display-5'>Welcome, (Username) !</h1>
      <hr className='my-2' />
      <p className='lead'>You're checked in for the following course:</p>
      <Button
        color='primary'
        onClick={props.handleCheckOut}
      >
        Check out
      </Button>
    </Container>
  );
}

class AdminLandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedIn: false
    };
  }

  handleCheckIn = () => {
    this.setState({
      checkedIn: true
    });
  };

  handleCheckOut = () => {
    this.setState({
      checkedIn: false
    });
  };

  render() {
    let adminPage = null;
    if (this.state.checkedIn) {
      adminPage = <AdminCheckoutForm
        handleCheckOut={() => this.handleCheckOut()}
      />;
    } else {
      adminPage = <AdminCheckinForm
        handleCheckIn={() => this.handleCheckIn()}
      />;
    }
    return (
      <div className='admin-landing-page'>
        {adminPage}
      </div>
    );
  }
}

export default AdminLandingPage;