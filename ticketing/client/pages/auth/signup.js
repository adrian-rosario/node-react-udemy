import { useState } from "react";
import hookRequest from "../../hooks/hook-request";
import Router from "next/router";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [errors, setErrors] = useState([]);
  const { useRequest, errors } = hookRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => {
      Router.push("/"); // reroute
    },
  });

  const formHandler = async (event) => {
    event.preventDefault();

    await useRequest();
    // try {
    //   const theResponse = await axios.post("/api/users/signup", {
    //     email,
    //     password,
    //   });

    //   console.log("form data:\n", theResponse.data);
    // } catch (error) {
    //   console.log(error.response.data);
    //   setErrors(error.response.data.errors);
    // }
  };

  return (
    <>
      <div style={{ margin: "10px" }}>
        <form onSubmit={formHandler}>
          <h1>Signup page</h1>

          <div className='form-group'>
            <label htmlFor='input_email'>Email Address</label>
            <input
              className='form-control'
              id='input_email'
              value={email}
              onChange={(theEvent) => {
                setEmail(theEvent.target.value);
              }}
            ></input>
          </div>

          <div className='form-group'>
            <label htmlFor='input_password'>Password</label>
            <input
              className='form-control'
              id='input_password'
              value={password}
              type='password'
              onChange={(theEvent) => {
                setPassword(theEvent.target.value);
              }}
            ></input>
          </div>

          {errors}

          <div style={{ marginTop: "10px" }}>
            <button className='btn btn-primary'>Sign Up</button>
          </div>
        </form>
      </div>
    </>
  );
}
