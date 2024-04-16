import "bootstrap/dist/css/bootstrap.css";
/**
 * Next wraps pages around it's own custom default component
 * that is referred to, as the 'app'
 * with _app we are defining our own custom app component
 * when one of our pages are navigated to
 * Next will import that component, and pass it into the Component
 * defined here.
 */
export default ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};
