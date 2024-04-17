import apiBuildClient from "../api/api-build-client";

const IndexPage = (currentUser) => {
  console.log("current user? ", { currentUser });

  return { currentUser } ? <h1>Signed in</h1> : <h1>NOT signed in</h1>;
};

// NextJS, retrieve values during server side rendering process
IndexPage.getInitialProps = async (context) => {
  //
  const client = apiBuildClient(context);
  const data = await client.get("/api/users/currentuser").catch((error) => {
    console.log(error.message);
  });

  return { data };
};

export default IndexPage;
