import React from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container
} from 'reactstrap';
import '../Stylesheets/UserCheckin.css';

class UserCheckinPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedIn: false,
      checkInButtonDisabled: true,
      checkInString: '',
      name: '',
      userId: ''
    }
  }

  handleCheckInStringChange = (event) => {
    if (event && event.target) {
      this.setState({
        checkInString: event.target.value
      }, () => {
        if (this.state.checkInString === '' && this.state.name === '' && this.state.userId === '') {
          this.setState({
            checkInButtonDisabled: true
          });
        } else if (this.state.checkInString !== '' && this.state.name !== '' && this.state.userId !== '') {
          this.setState({
            checkInButtonDisabled: false
          });
        }
      });
    }
  };

  handleNameChange = (event) => {
    if (event && event.target) {
      this.setState({
        name: event.target.value
      }, () => {
        if (this.state.checkInString === '' && this.state.name === '' && this.state.userId === '') {
          this.setState({
            checkInButtonDisabled: true
          });
        } else if (this.state.checkInString !== '' && this.state.name !== '' && this.state.userId !== '') {
          this.setState({
            checkInButtonDisabled: false
          });
        }
      });
    }
  };

  handleUserIdChange = (event) => {
    if (event && event.target) {
      this.setState({
        userId: event.target.value
      }, () => {
        if (this.state.checkInString === '' && this.state.name === '' && this.state.userId === '') {
          this.setState({
            checkInButtonDisabled: true
          });
        } else if (this.state.checkInString !== '' && this.state.name !== '' && this.state.userId !== '') {
          this.setState({
            checkInButtonDisabled: false
          });
        }
      });
    }
  };

  handleCheckIn = () => {
    this.checkIn()
      .then((res) => {
        if (res.eventSuccess) {
          this.setState({
            checkedIn: true
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  checkIn = async () => {
    const response = await fetch('/checkins', {
      method: 'POST',
      headers: {
        'Accept': 'application/JSON',
        'Content-Type': 'application/JSON'
      },
      body: JSON.stringify({
        checkInString: this.state.checkInString,
        name: this.state.name,
        userId: this.state.userId
      })
    });

    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }

    return body;
  };

  render() {
    let checkInForm = null;
    if (!this.state.checkedIn) {
      checkInForm =
        <div>
          <h1 className='display-5'>Welcome anonymous user!</h1>
          <hr className='my-2'/>
          <Form>
            <FormGroup>
              <Label for='checkInString'>
                Course id:
              </Label>
              <Input
                type='text'
                name='checkInString'
                placeholder='Enter your check in string'
                onChange={this.handleCheckInStringChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for='name'>
                Name:
              </Label>
              <Input
                type='text'
                name='name'
                placeholder='Enter your name'
                onChange={this.handleNameChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for='userId'>
                User ID:
              </Label>
              <Input
                type='text'
                name='userId'
                placeholder='Enter your user ID'
                onChange={this.handleUserIdChange}
              />
            </FormGroup>
          </Form>
          <Button
            color='primary'
            className='check-in-button'
            onClick={this.handleCheckIn}
          >
            Check in
          </Button>
        </div>;
    } else {
      checkInForm = <h1 className='display-5'>Thanks for checking in! Enjoy the event!</h1>;
    }

    return (
      <div className='user-checkin-page'>
        <Container className='user-checkin-container'>
          {checkInForm}
        </Container>
      </div>
    );
  }
}

export default UserCheckinPage;