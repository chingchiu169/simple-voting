import user from "../views/user";
import campaign from "../views/campaign";

var routes = [
  {
    path: "/user",
    component: user,
    layout: "users"
  },
  {
    path: "/campaigns",
    component: campaign,
    layout: "campaigns"
  },
];

export default routes;
