import React from "react";
import {
  Container,
  Col,
  Row,
  Button,
  Form,
  Input,
} from "reactstrap";
// import utils from '../utils/utils';
import hkid from '../utils/hkid';
import userService from '../services/userService';

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null, hkid: "" };
  }
  componentDidMount = () => {
    // this.getUser();
  }
  // Check user and auto login to campaign page
  getUser = async () => {
    let user = JSON.parse(window.localStorage.getItem('user'));
    if (user) {
      let result = await userService.checkUser(user);
      if (!result.error) {
        this.props.history.push('/campaigns')
      }
    }
  }
  // Check and Reg User
  regUser = async () => {
    // Valid HKID
    let valid = this.validHKID(this.state.hkid);
    if (!valid) {
      alert("Please input valid HKID");
      return;
    }
    let result = null;
    let user = JSON.parse(window.localStorage.getItem('user'));
    // If exist then check
    if (user) {
      result = await userService.checkUser({ token: user.token });
      // If expired then update
      if (result.error) {
        if (result.message === 'Your token has expired.') {
          result = await userService.updateUser({ hkid: this.state.hkid, token: user.token });
          if (result.error === true) {
            alert(result.message);
            return;
          }
          window.localStorage.setItem('user', JSON.stringify(result.user));
        }
      }
      this.props.history.push('/campaigns');
    }
    else {
      // If not exist
      user = {};
      user.hkid = this.state.hkid;
      result = await userService.regUser(user);
      window.localStorage.setItem('user', JSON.stringify(result.user));
      this.props.history.push('/campaigns');
    }
  }
  editinput = (event) => {
    this.setState({ hkid: event.target.value });
  }
  validHKID = (value) => {
    return hkid.isHKID(value);
  }
  genHKID = () => {
    this.setState({ hkid: hkid.randomHKID() })
  }
  render() {
    const { user, hkid } = this.state;
    return (
      <>
        <Container style={{ maxWidth: '720px', padding: '15px 0px' }}>
          {
            user ?
              <Row>
                <Col>

                </Col>
              </Row>
              :
              <Row>
                <Col>
                  <Form>
                    <Input type="text" placeholder="HKID" value={hkid} onChange={this.editinput} />
                    <Button color="info" size="sm" style={{ minWidth: 80 }} onClick={() => this.regUser()}>SUBMIT</Button>
                    {
                      process.env.REACT_APP_ENV === "development" ?
                        < Button color="info" size="sm" style={{ minWidth: 80 }} onClick={() => this.genHKID()}>GENHKID</Button>
                        :
                        null
                    }
                  </Form>
                </Col>
              </Row>
          }
        </Container>
      </>
    )
  }
}

export default User;