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
            const res = await axios.post(process.env.REACT_APP_HOST+'/login/google', { credentialResponse });
            if(res.status === 201){
              sendData(res.data)
            } else if (res.status === 200) {
                props.onHide()
                props.setUserId(res.data.username)
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

