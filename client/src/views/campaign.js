import React from "react";
import {
  Container,
  Col,
  Row,
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  CardHeader,
  CardFooter,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import userService from '../services/userService';
import campaignService from '../services/campaignService';
import voteService from "../services/voteService";
import utils from "../utils/utils";

Array.prototype.sum = function (prop) {
  var total = 0
  for (var i = 0, _len = this.length; i < _len; i++) {
    total += this[i][prop]
  }
  return total
}

class Campaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: {}, user_voted: [], campaign_modal: false, campaign: { options: [] }, campaigns: [], vote_modal: false, autorefreshtime: 0, autorefreshdropdown: false };
  }
  componentDidMount = () => {
    this.getUser();
  }
  getUser = async () => {
    let user = JSON.parse(window.localStorage.getItem('user'));
    if (user) {
      let result = await userService.checkUser({ token: user.token, hkid: this.props.location.state.hkid });
      if (!result.error) {
        this.setState({ user: user });
        this.getCampaigns();
        this.getUserVoted(user);
      }
      else {
        this.props.history.push('/user');
      }
    }
    else {
      this.props.history.push('/user');
    }
  }
  getUserVoted = async (user) => {
    let result = await voteService.getVoted(user);
    this.setState({ user_voted: result.votes })
  }
  getCampaigns = async () => {
    let { orderBy } = this.state;
    let campaigns = await campaignService.getAll();
    if (orderBy) {
      this.orderBy(orderBy);
    }
    else {
      this.setState({ campaigns: campaigns.campaigns });
    }
  }
  startcount = (timeout) => {
    let x = setInterval(() => {
      timeout = (timeout - 1000);
      this.setState({ refresh: timeout / 1000 });
      if (timeout === 0) {
        timeout = this.state.autorefreshtime;
        this.getCampaigns();
      }
      if (this.state.autorefreshtime === 0) {
        clearInterval(this.state.autorefresh)
      }
    }, 1000);
    this.setState({ autorefresh: x });
  }
  toogleAutoRefresh = (time) => {
    this.setState({ autorefreshtime: time, refresh: time / 1000 });
    clearInterval(this.state.autorefresh);
    this.startcount(time);
  }
  toggleDropdown = () => {
    this.setState({ autorefreshdropdown: !this.state.autorefreshdropdown })
  }
  toggleModal = () => {
    this.setState({ campaign_modal: !this.state.campaign_modal })
  }
  editCampaign = (event) => {
    let { campaign } = this.state;
    let value = event.target.value;
    let field = event.target.name;
    campaign[field] = value;
    this.setState({ campaign: campaign })
  }
  addOption = () => {
    let { campaign } = this.state;
    campaign.options.push({ option: campaign.option, voted: 0 });
    campaign.option = "";
    this.setState({ campaign: campaign })
  }
  newCampaign = async () => {
    let { campaign } = this.state;
    if (campaign.options.length < 2) {
      alert("Must more than 1 options");
      return;
    }
    let data = await campaignService.regCampaign(campaign);
    if (!data.error) {
      this.toggleModal();
      this.setState({ campaign: { options: [] } });
    }
  }
  orderBy = (type) => {
    let { campaigns } = this.state;
    switch (type) {
      case 1:
        campaigns.sort((a, b) => (new Date(a.time).getTime() < new Date(b.time).getTime()) ? 1 : ((new Date(b.time).getTime() < new Date(a.time).getTime()) ? -1 : 0));
        break;
      case 2:
        campaigns.sort((a, b) => (a.options.sum('voted') < b.options.sum('voted') ? 1 : (b.options.sum('voted') < a.options.sum('voted')) ? -1 : 0));
        break;
      case 3:
        campaigns.sort((a, b) => (new Date(a.start).getTime() > new Date(b.start).getTime()) ? 1 : ((new Date(b.start).getTime() > new Date(a.start).getTime()) ? -1 : 0));
        break;
      case 4:
        campaigns.sort((a, b) => (new Date(a.end).getTime() < new Date(b.end).getTime()) ? 1 : ((new Date(b.end).getTime() < new Date(a.end).getTime()) ? -1 : 0));
        break;
      case 5:
        campaigns.sort((a) => (new Date(a.start).getTime() < new Date().getTime() && new Date(a.end).getTime() > new Date().getTime()) ? -1 : (new Date(a.end).getTime() < new Date().getTime()) ? 1 : 0);
        break;
      case 6:
        campaigns.sort((a) => (new Date(a.end).getTime() > new Date().getTime()) ? 1 : ((new Date().getTime() > new Date(a.end).getTime()) ? -1 : 0));
        break;
      default:
    }
    this.setState({ campaigns: campaigns, orderBy: type });
  }
  quitCampign = () => {
    this.props.history.push('/user');
  }
  voteModal = (index) => {
    this.setState({ vote_modal: !this.state.vote_modal, campaign: this.state.campaigns[index] })
  }
  toggleVoteModal = () => {
    this.setState({ vote_modal: !this.state.vote_modal, campaign: { options: [] } })
  }
  voteThis = async (value) => {
    let vote = {};
    vote.token = this.state.user.token;
    vote.campaign = this.state.campaign._id;
    vote.for = value;
    let result = await voteService.voteCampaign(vote);
    if (result.error) {
      alert(result.message);
      return;
    }
    this.getCampaigns();
    this.getUserVoted(this.state.user);
    this.toggleVoteModal();
    // window.location.href = '/campaigns';
  }
  render() {
    const { user_voted, campaign_modal, campaign, campaigns, vote_modal, refresh, autorefreshtime, autorefreshdropdown } = this.state;
    const endstyle = {
      backgroundColor: "#696969",
      color: "#ffffff"
    }
    return (
      <>
        <Container style={{ maxWidth: '720px' }}>
          <Row style={{ padding: '15px 0px' }}>
            {
              process.env.REACT_APP_ENV === "development" ?
                <Col sm="1">
                  <Button size="sm" onClick={() => this.toggleModal()}>NEW</Button>
                </Col>
                :
                null
            }
            <Col sm="1">
              <Button size="sm" onClick={() => this.quitCampign()}>QUIT</Button>
            </Col>
            <Col className="text-right">
              Order By : {` `}
              <Button size="sm" onClick={() => this.orderBy(1)}>Most Recent</Button>
              <Button size="sm" onClick={() => this.orderBy(2)}>Most Voted</Button>
              <Button size="sm" onClick={() => this.orderBy(3)}>Start Time</Button>
              <Button size="sm" onClick={() => this.orderBy(4)}>End Time</Button>
              <Button size="sm" onClick={() => this.orderBy(5)}>Started</Button>
              <Button size="sm" onClick={() => this.orderBy(6)}>Ended</Button>
            </Col>
          </Row>
          <Row>
            <Col>
              {
                autorefreshtime === 0 ?
                  "Auto refresh stopped"
                  :
                  " Auto refresh in " + refresh + "s"
              }
            </Col>
            <Col className="text-right">
              <Dropdown isOpen={autorefreshdropdown} toggle={this.toggleDropdown} size="sm">
                <DropdownToggle caret>
                  Refresh Time
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem active onClick={() => { this.toogleAutoRefresh(0) }}>Off</DropdownItem>
                  <DropdownItem onClick={() => { this.toogleAutoRefresh(10000) }}>10s</DropdownItem>
                  <DropdownItem onClick={() => { this.toogleAutoRefresh(20000) }}>20s</DropdownItem>
                  <DropdownItem onClick={() => { this.toogleAutoRefresh(30000) }}>30s</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>
          {
            campaigns ?
              <Row>
                <Col>
                  {
                    campaigns.map((value, index) => {
                      return (
                        <Card key={value._id} style={{ margin: "15px 0" }}>
                          <CardHeader style={utils.checkstatus(value) === 2 ? endstyle : {}}>
                            <Row>
                              <Col>
                                Campaign : {value.title}
                              </Col>
                              {
                                (user_voted.findIndex(x => x.campaign === value._id) > -1) ?
                                  <Col className="text-right">Voted</Col>
                                  :
                                  utils.checkstatus(value) === 0 ?
                                    <Col className="text-right">Not yet started</Col>
                                    :
                                    utils.checkstatus(value) === 1 ?
                                      <Col className="text-right"><Button size="sm" onClick={() => this.voteModal(index)}>Vote</Button></Col>
                                      :
                                      utils.checkstatus(value) === 2 ?
                                        <Col className="text-right">Ended</Col>
                                        :
                                        null
                              }
                            </Row>
                          </CardHeader>
                          <CardBody>
                            <Row>
                              <Col>
                                {value.description}
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                Start : {value.start}
                              </Col>
                              <Col>
                                End : {value.end}
                              </Col>
                            </Row>
                            <Row>
                              <ol>
                                {
                                  value.options.map((option, key) => {
                                    return (user_voted.findIndex(x => x.campaign === value._id && x.for === option.option) > -1) ?
                                      <li key={key}>{option.option} - {option.voted}  (You Voted)</li>
                                      :
                                      <li key={key}>{option.option} - {option.voted}</li>
                                  })
                                }
                              </ol>
                            </Row>
                          </CardBody>
                          <CardFooter>
                            <Row>
                              {
                                utils.checkstatus(value) === 0 ?
                                  <Col>Not yet started</Col>
                                  :
                                  utils.checkstatus(value) === 1 ?
                                    <Col>Started</Col>
                                    :
                                    utils.checkstatus(value) === 2 ?
                                      <Col>Ended</Col>
                                      :
                                      null
                              }
                            </Row>
                          </CardFooter>
                        </Card>
                      )
                    })
                  }
                </Col>
              </Row>
              :
              <Row>
                <Col>
                  No campaign
                </Col>
              </Row>
          }
        </Container>
        <Modal isOpen={campaign_modal}>
          <ModalHeader>New Campaign</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label>Title</Label>
                <Input type="text" name="title" onChange={this.editCampaign} value={campaign.title || ''} />
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <Input type="text" name="description" onChange={this.editCampaign} value={campaign.description || ''} />
              </FormGroup>
              <FormGroup>
                <Label>Start</Label>
                <Input type="date" name="start" onChange={this.editCampaign} value={campaign.start || ''} />
              </FormGroup>
              <FormGroup>
                <Label>End</Label>
                <Input type="date" name="end" onChange={this.editCampaign} value={campaign.end || ''} />
              </FormGroup>
              <FormGroup>
                <Label>Options</Label>
                <Input type="text" name="option" onChange={this.editCampaign} value={campaign.option || ''} />
                <Button style={{ float: "right" }} onClick={() => this.addOption()}>+</Button>
                <ol>
                  {
                    campaign.options.map((value, index) => {
                      return (
                        <li key={index}>{value.option}</li>
                      )
                    })
                  }
                </ol>
              </FormGroup>
              <Button onClick={() => this.newCampaign()}>Submit</Button>
              <Button onClick={() => this.toggleModal()}>Cancel</Button>
            </Form>
          </ModalBody>
        </Modal>
        <Modal isOpen={vote_modal}>
          <ModalHeader>Vote Campaign</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label>Title</Label>
                <Input type="text" name="title" value={campaign.title || ''} readOnly />
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <Input type="text" name="description" value={campaign.description || ''} readOnly />
              </FormGroup>
              <FormGroup>
                <Label>Start</Label>
                <Input type="date" name="start" value={campaign.start || ''} readOnly />
              </FormGroup>
              <FormGroup>
                <Label>End</Label>
                <Input type="date" name="end" value={campaign.end || ''} readOnly />
              </FormGroup>
              <FormGroup>
                <Label>Options</Label>
                <ol>
                  {
                    campaign.options.map((value, index) => {
                      return (
                        <li style={{ minWidth: "100%", paddingBottom: "5px" }} key={index}><Button size="sm" block onClick={() => this.voteThis(value.option)}>{value.option}</Button></li>
                      )
                    })
                  }
                </ol>
              </FormGroup>
              <Button onClick={() => this.toggleVoteModal()}>Cancel</Button>
            </Form>
          </ModalBody>
        </Modal>
      </>
    )
  }
}

export default Campaign;