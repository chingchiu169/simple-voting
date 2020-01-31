import React from "react";
import { Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import routes from "../routes/routes";

class userLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "users") {
        return (
          <Route
            path={prop.path}
            render={props => <prop.component {...props} />}
            key={key}
          />
        );
      }
      else{
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

export default userLayout;
