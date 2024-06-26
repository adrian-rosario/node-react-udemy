import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const useRequest = async () => {
    try {
      setErrors(null); // clear out previous error
      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (theError) {
      setErrors(
        <div className='alert alert-danger' style={{ marginTop: "10px" }}>
          <h4>Oops.</h4>
          <ul>
            {theError.response.data.errors.map((theError) => (
              <li key={theError.message}>{theError.message}</li>
            ))}
          </ul>
        </div>
      );
      // throw theError;
    }
  };

  return { useRequest, errors };
};
