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

function History(props) {
  return (
    <div>
    </div>
  );
}

function AdminStartEventForm(props) {
  return (
    <Container className='admin-landing-container'>
      <h1 className='display-5'>Welcome, {props.username} !</h1>
      <hr className='my-2' />
      <Form>
        <FormGroup>
          <Label for='courseId'>
            Course id:
          </Label>
          <Input
            type='text'
            name='courseId'
            className='courseId'
            placeholder='Enter your course id'
            onChange={props.handleCourseIdChange}
          />
        </FormGroup>
      </Form>
      <Button
        color='primary'
        disabled={props.startEventButtonDisabled}
        onClick={props.handleStartEvent}
      >
        Start Event
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

function AdminStopEventForm(props) {
  return (
    <Container className='admin-landing-container'>
      <h1 className='display-5'>Welcome, {props.username} !</h1>
      <hr className='my-2' />
      <p className='lead'>You've started an event for the following course: {props.courseId}</p>
      <Button
        color='primary'
        onClick={props.handleStopEvent}
      >
        Stop Event
      </Button>
    </Container>
  );
}

class AdminLandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventActive: false,
      startEventButtonDisabled: true,
      courseId: ''
    };
  }

  createEvent = async () => {
    const response = await fetch('/events', {
      method: 'POST',
      headers: {
        'Accept': 'application/JSON',
        'Content-Type': 'application/JSON'
      },
      body: JSON.stringify({
        courseId: this.state.courseId
      })
    });

    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }

    return body;
  };

  determineIfEventActive = async () => {
    const response = await fetch('/events', {
      method: 'GET',
      headers: {
        'Accept': 'application/JSON',
        'Content-Type': 'application/JSON',
        'Type': 'determineActive'
      }
    });

    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }

    return body;
  };

  deactivateEvent = async () => {
    const response = await fetch('/events', {
      method: 'GET',
      headers: {
        'Accept': 'application/JSON',
        'Content-Type': 'application/JSON',
        'Type': 'deactivateEvent'
      }
    });

    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }

    return body;
  };

  handleStartEvent = () => {
    this.createEvent()
      .then((res) => {
        if (res.eventSuccess) {
          this.setState({
            eventActive: true
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleStopEvent = () => {
    this.deactivateEvent()
      .then((res) => {
        if (res.eventSuccess) {
          this.setState({
            eventActive: false
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleCourseIdChange = (event) => {
    if (event && event.target) {
      this.setState({
        courseId: event.target.value
      }, () => {
        if (this.state.courseId === '') {
          this.setState({
            startEventButtonDisabled: true
          });
        } else {
          this.setState({
            startEventButtonDisabled: false
          });
        }
      });
    }
  };

  componentWillMount () {
    this.determineIfEventActive()
      .then((res) => {
        if (res.activeEventExists) {
          this.setState({
            eventActive: true
          })
        } else {
          this.setState({
            eventActive: false
          })
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  render () {
    let AdminPage = null;
    if (this.state.eventActive) {
      AdminPage = <AdminStopEventForm
        username={this.props.username}
        courseId={this.state.courseId}
        handleStopEvent={() => this.handleStopEvent()}
      />;
    } else {
      AdminPage = <AdminStartEventForm
        username={this.props.username}
        startEventButtonDisabled={this.state.startEventButtonDisabled}
        handleStartEvent={() => this.handleStartEvent()}
        handleCourseIdChange={(event) => this.handleCourseIdChange(event)}
      />;
    }
    return (
      <div className='admin-landing-page'>
        {AdminPage}
      </div>
    );
  }
}

export default AdminLandingPage;