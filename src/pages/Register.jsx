import { registerUser } from "../services/firestore";

const handleRegister = async () => {
  const user = {
    name,
    dob,
    mobile,
    createdAt: new Date()
  };

  const userId = await registerUser(user);
  alert("Registered Successfully");
};