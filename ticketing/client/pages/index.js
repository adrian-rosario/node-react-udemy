// import axios from "axios";
import apiBuildClient from "../api/api-build-client";

const IndexPage = ({ currentUser }) => {
  console.log("current user? ", currentUser);

  return currentUser ? <h1>Signed In</h1> : <h1>NOT Signed In</h1>;
};

// NextJS, retrieve values during server side rendering process
IndexPage.getInitialProps = async (context) => {
  const client = apiBuildClient(context);
  const { data } = await client.get("/api/users/currentuser").catch((err) => {
    console.log(err.message);
  });

  console.log("=== Landing page - getInitialProps");

  return data;
};

export default IndexPage;
