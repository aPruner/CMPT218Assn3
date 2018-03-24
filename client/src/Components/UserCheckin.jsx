import React from 'react';
import {
  Button,
  Container
} from 'reactstrap';
import '../Stylesheets/UserCheckin.css';

class UserCheckinPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      something: ''
    }
  }

  render() {
    return (
      <div className='user-checkin-page'>
        <Container className='user-checkin-container'>
          <h1 className='display-5'>Welcome anonymous user!</h1>
          <hr className='my-2' />
          <Button
            color='primary'
          >
            Check in
          </Button>
        </Container>
      </div>
    );
  }
}

export default UserCheckinPage;