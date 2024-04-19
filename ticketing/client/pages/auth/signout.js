import { useEffect } from "react";
import hookRequest from "../../hooks/hook-request";
import Router from "next/router";

export default function SignOut() {
  const { useRequest } = hookRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => {
      Router.push("/"); // reroute
    },
  });

  useEffect(() => {
    // synchronize a component with an external system
    // Effects let you run some code after rendering so
    // that you can synchronize your component with some
    // system outside of React
    useRequest();
  }, []);

  return (
    <>
      <h2>Signed out</h2>
    </>
  );
}
