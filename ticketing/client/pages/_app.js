import "bootstrap/dist/css/bootstrap.css";
import apiBuildClient from "../api/api-build-client";
import Header from "../components/header";

/**
 * Next wraps pages around it's own custom default component
 * that is referred to as the 'app'
 * with _app we are defining our own custom app component
 * when one of our pages are navigated to
 * Next will import that component, and pass it into the Component
 * defined here.
 */
export default function AppComponent({ Component, pageProps, currentUser }) {
  if (currentUser) {
    console.log("==== ", { currentUser });
  }
  return (
    <>
      <div>
        <Header currentUser={currentUser} />
        <Component {...pageProps} />
      </div>
    </>
  );
}

AppComponent.getInitialProps = async (appContext) => {
  // console.log(Object.keys(appContext));
  const client = apiBuildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");
  // console.log("=== AppComponent - getInitialProps");
  // console.log("=== _app, getInitialProps\n", data);
  let pageProps = {};
  // so we don't call this in every page, ie. signup
  // pages that have a getInitialProps call will have a Component.getInitialProps
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  console.log("=== pageProps from AppComponent: ", pageProps);

  return {
    pageProps,
    ...data,
  };
};
