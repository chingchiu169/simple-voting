import React from "react";
import { Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import routes from "../routes/routes";

class campaignLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "campaigns") {
        return (
          <Route
            path={prop.path}
            render={props => <prop.component {...props} />}
            key={key}
          />
        );
      }
      else {
        return null
      }
    });
  };
  render() {
    return (
      <>
        <Container>
          <Switch>{this.getRoutes(routes)}</Switch>
        </Container>
      </>
    );
  }
}

export default campaignLayout;
