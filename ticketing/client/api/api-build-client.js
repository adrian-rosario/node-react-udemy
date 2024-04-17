import axios from "axios";

export default ({ req }) => {
  if (typeof window === undefined) {
    // to server
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // to client
    return axios.create({
      baseUrl: "/",
    });
  }
};
