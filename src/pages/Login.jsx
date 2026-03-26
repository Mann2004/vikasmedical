import { loginUser } from "../services/firestore";

const handleLogin = async () => {
  const user = await loginUser(name, dob);

  if (user) {
    alert("Login Success");
    console.log(user);
  } else {
    alert("User not found");
  }
};