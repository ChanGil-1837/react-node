import React from 'react';
import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google"
import axios from 'axios';
const GoogleLoginButton = (props) => {
  
  const sendData = (data)=> {
    props.page("Register",data)
  }

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GGLE_KEY}>
      <GoogleLogin
        useOneTap
        onSuccess={async (credentialResponse) => {
          try {
            const res = await axios.post(process.env.REACT_APP_SERVER_HOST+'/login/google', { credentialResponse });
            if(res.data.page === "register"){
              sendData(res.data.email)
            } else if (res.data.page === "login") {
                props.setUserId(res.data.username)
		            props.onHide()
            }
          } catch (error) {
            console.error(error);
          }
        }}
        onError={error => {
          console.log(error);
        }}
      />
    </GoogleOAuthProvider>
  );
}
export default GoogleLoginButton

