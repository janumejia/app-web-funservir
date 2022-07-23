import axios from "axios";
import { useEffect, useState } from "react";

const UserName = () => {
  const [name, setName] = useState(" ");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios
        .get(`http://localhost:4000/user`, {
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