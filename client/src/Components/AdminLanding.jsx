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
    <Container className='admin-landing-container'>
      <h1 className='display-5'>Check in history for {props.courseId}:</h1>
      <hr className='my-2' />
      {props.history}
      <Button
        color='primary'
        onClick={props.handleBackFromHistory}
      >
        Back
      </Button>
    </Container>
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
        disabled={props.viewHistoryButtonDisabled}
        className='view-history-button'
        onClick={props.handleViewHistory}
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
      viewHistoryButtonDisabled: true,
      viewHistory: false,
      courseId: '',
      history: []
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

  fetchHistory = async () => {
    const response = await fetch('/events', {
      method: 'GET',
      headers: {
        'Accept': 'application/JSON',
        'Content-Type': 'application/JSON',
        'Type': 'fetchHistory',
        'CourseId': this.state.courseId
      }
    });

    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }

    return body;
  };

  mapDataToHistory = (data) => {
    return data.map((event) => {
      let checkIns = event.checkIns.map((checkIn) => {
        return (
          <div>
            <hr className='my-2' />
            <p>Check in string: {checkIn.checkInString}</p>
            <p>Name: {checkIn.name}</p>
            <p>User ID: {checkIn.userId}</p>
          </div>
        )
      });
      return (
        <div key={event.id}>
          <h1 className='display-5'>Event ID: {event.id}</h1>
          <p className='lead'>Event check ins: </p>
          {checkIns}
          <hr className='my-2' />
        </div>
      )
    })
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

  handleViewHistory = () => {
    this.fetchHistory()
      .then((res) => {
        if (res.eventSuccess) {
          console.log('in client side, events is:', res.events);
          this.setState({
            viewHistory: true,
            history: this.mapDataToHistory(res.events)
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleBackFromHistory = () => {
    this.setState({
      history: [],
      viewHistory: false
    })
  };

  handleCourseIdChange = (event) => {
    if (event && event.target) {
      this.setState({
        courseId: event.target.value
      }, () => {
        if (this.state.courseId === '') {
          this.setState({
            startEventButtonDisabled: true,
            viewHistoryButtonDisabled: true
          });
        } else {
          this.setState({
            startEventButtonDisabled: false,
            viewHistoryButtonDisabled: false
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
    if (this.state.viewHistory) {
      AdminPage = <History
        history={this.state.history}
        courseId={this.state.courseId}
        handleBackFromHistory={() => this.handleBackFromHistory()}
      />;
    } else {
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
          viewHistoryButtonDisabled={this.state.viewHistoryButtonDisabled}
          handleStartEvent={() => this.handleStartEvent()}
          handleCourseIdChange={(event) => this.handleCourseIdChange(event)}
          handleViewHistory={this.handleViewHistory}
        />;
      }
    }
    return (
      <div className='admin-landing-page'>
        {AdminPage}
      </div>
    );
  }
}

export default AdminLandingPage;