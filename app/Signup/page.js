"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  //initialise router
  const router = useRouter();

  const [getEmail, setEmail] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getConfPassword, setConfPassword] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>Create Account</div>
      <div>Email Entered : {getEmail}</div>
      <div>Password Entered : {getPassword}</div>
      <div>Confirm Password : {getConfPassword}</div>
      <InputField
        placeholder={"Email"}
        type="text"
        userInputTyped={(emailValue) => {
          setEmail(emailValue);

          console.log(emailValue);
        }}
      />
      <InputField
        placeholder={"Password"}
        type="password"
        userInputTyped={(passwordValue) => {
          setPassword(passwordValue);
        }}
      />
      <InputField
        placeholder={"Confirm Password"}
        type="password"
        userInputTyped={(confPassValue) => {
          setConfPassword(confPassValue);
        }}
      />
      <button
        style={{
          background: "orange",
          width: "200px",
        }}
        onClick={(event) => {
          //1. None of the fields are empty
          //2. email should contain @
          //3. password and confirm password should match
          //4. length of the password should be 8

          if (getEmail == null || getPassword == "" || getConfPassword == "") {
            alert("All Fields are mandatory!");
            return;
          } else if (getEmail.includes("@") == false) {
            alert("Enter Valid Email!");
          } else if (getPassword != getConfPassword) {
            alert("Both Passwords should match!");
          } else if (getPassword.length < 8 || getConfPassword.length < 8) {
            alert("Weak Password: Min. supported length is 8");
          } else {
            //Navigation
            router.push(
              `/user-details?email=${getEmail}&password=${getPassword}`,
            );
          }
        }}
      >
        Create Account
      </button>
    </div>
  );
}

function InputField({ placeholder, type, userInputTyped }) {
  return (
    <input
      style={{
        width: "200px",
        height: "50px",
        border: "2px solid blue",
      }}
      placeholder={placeholder}
      type={type}
      onChange={(event) => {
        userInputTyped(event.target.value);
      }}
    />
  );
}