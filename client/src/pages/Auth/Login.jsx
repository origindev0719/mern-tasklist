import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { loginUser, register } from "../../actions/auth";

const LoginForm = () => {
  const location = useLocation();
  const [isRegister, setIsRegister] = useState(false);
  const [validateEmail, setValidateEmail] = useState(null);
  const [userData, setUserData] = useState({
    username: " ",
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setUserData({ ...userData, [name]: value });
  };

  const handleRegister = async () => {
    const {
      data: { error }
    } = await register(userData);
    error && setValidateEmail(error);
    !error && setValidateEmail(null);
    if (!error) navigate("/login");
  };

  const handleSignin = async () => {
    await loginUser(userData)(navigate)(dispatch);
  };

  useEffect(() => {
    setIsRegister(location.pathname === "/signup");
  }, [location]);

  const user = localStorage.getItem("token");
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [navigate, user]);

  return (
    <div className="flex justify-center min-h-screen ">
      <Card
        color="transparent"
        shadow={false}
        className="justify-center items-center"
      >
        <Typography variant="h1" color="blue-gray">
          {isRegister ? "Sign Up" : "Sign In"}
        </Typography>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
          <div className="mb-4 flex flex-col gap-6">
            {isRegister && (
              <Input
                type="text"
                label="Name"
                name="username"
                defaultValue={userData.username}
                size="lg"
                onChange={handleChange}
              />
            )}
            <Input
              type="email"
              name="email"
              defaultValue={userData.email}
              label="Email"
              size="lg"
              onChange={handleChange}
            />
            {validateEmail && isRegister && (
              <Typography color="pink" className=" m-0 p-0">
                {validateEmail && validateEmail}
              </Typography>
            )}
            <Input
              type="password"
              name="password"
              defaultValue={userData.password}
              label="Password"
              size="lg"
              onChange={handleChange}
            />
          </div>
          <Button
            className="mt-6"
            fullWidth
            onClick={isRegister ? handleRegister : handleSignin}
          >
            {isRegister ? "Sign Up" : "Sign In"}
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal">
            {isRegister
              ? "Already have an account? "
              : "Don't have an account? "}
            <Link
              to={isRegister ? "/login" : "/signup"}
              className="font-medium text-blue-500 transition-colors hover:text-blue-700"
            >
              {isRegister ? "Sign In" : "Sign Up"}
            </Link>
          </Typography>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;
