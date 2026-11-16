import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

async function createCustomer(email, password, confirm) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      //SUCCESS CASE
      alert(JSON.stringify(userCredentials.user));
    })
    .catch((reason) => {
      alert(JSON.stringify(reason));
    });
}