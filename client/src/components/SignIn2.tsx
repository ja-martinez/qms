

import { useAuthSignInWithEmailAndPassword } from "@/hooks/react-query-firebase/mutations"
import { useAuthIdToken } from "@/hooks/react-query-firebase/useAuthIdToken"
import {auth} from "@/firebase"



export function SignIn2() {


  const userToken = useAuthIdToken(["token"], auth);

  const mutation = useAuthSignInWithEmailAndPassword(auth);

  function handleClick() {
    mutation.mutate({email: "alejandro@clavius.dev", password: "password"})
  }

  if (userToken.isLoading) {
    <div>Loading...</div>
  }

  if (userToken.data) {
    return <div>ID Token: {JSON.stringify(userToken.data.token)}!</div>;
  }

  return <button onClick={handleClick} >Click</button>;
}
