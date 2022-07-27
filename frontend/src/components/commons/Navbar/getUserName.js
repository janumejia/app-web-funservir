import axios from "axios";
import { useEffect, useState } from "react";

const UserName = () => {
  const [name, setName] = useState(" ");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_HOST_BACK}/user`, {
          headers: {
            token: token,
          },
        })
        .then(({ data }) => setName(data.name))
        .catch((error) => console.error(error));
    }
  }, [token]);
  return name;
}

export const GetUserName = UserName();