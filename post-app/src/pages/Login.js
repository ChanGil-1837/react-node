import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React,{useState,useEffect, useRef} from 'react';
import Form from "react-bootstrap/Form";
import axios from 'axios';
axios.defaults.withCredentials = true;

const Login = ({show, onHide, setUserId,}) =>{
  const [value, setValue] = useState({
      username:"",
      password: "",
      nickname:""
  })
  let [page,setPage] = useState("Login")

  const handleChange = e => {
      setValue({
          ...value,
          [e.target.name] : e.target.value,
      })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      var post = "http://localhost:8080/login"
      if (page=="Register") {
        post = "http://localhost:8080/register"
      }
      const response = await axios.post(post, value);
      if( response.status == 200 ) {
        onHide()
        setPage("Login")
        setUserId(response.data.username)
      }
    } catch (error) {
      console.log("error", error);
    }
  };

    

  return (
      <Modal
        show = {show}
        onHide = {onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
      <div style={{padding:"15px"}}>
      
        {
          page == "Login" ? <LoginPage onHide = {onHide} handleSubmit = {handleSubmit} handleChange = {handleChange} setPage={setPage} /> :
                 <RegisterPage onHide = {onHide} handleSubmit = {handleSubmit} handleChange = {handleChange} setPage = {setPage}/>
        }   

      </div>
      </Modal>
    );
}

const LoginPage = (props) => {
  return (
  <Form onSubmit={props.handleSubmit} method = "POST">
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        Login
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" name = "username" placeholder="Enter email" onChange={props.handleChange}/>
          <Form.Text className="text-muted" >
          We'll never share your email with anyone else.
          </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" placeholder="Password" onChange={props.handleChange}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
      <div style={{padding:"15px"}}>
        <Button variant="success" onClick={() => { props.setPage("Register")}} style = {{float : "left"}}>
            Sign Up
        </Button>
        <Button onClick={props.onHide} variant = "danger"style = {{float : "right", marginLeft:"10px"}}>Close</Button>
        <Button variant="primary" type="submit"style = {{float : "right"}}>
            Login
        </Button>
      </div>
    </Modal.Body>
    </Form>

  )
}
const RegisterPage = (props) => {
  return (     
    <Form onSubmit={props.handleSubmit} method = "POST">
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        Register
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" name = "username" placeholder="Enter email" onChange={props.handleChange}/>
          <Form.Text className="text-muted" >
          We'll never share your email with anyone else.
          </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicNickname">
          <Form.Label>Nickname</Form.Label>
          <Form.Control type="text" name = "nickname" placeholder="Nickname" onChange={props.handleChange}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" placeholder="Password" onChange={props.handleChange}/>
      </Form.Group>
      <div style={{padding:"15px"}}>
        <Button variant="warning" onClick={() => { props.setPage("Login")}} style = {{float : "left"}}>
            Sign In
        </Button> 
        <Button onClick={() => {props.onHide();  props.setPage("Login");}} variant = "danger"style = {{float : "right", marginLeft:"10px"}}>Close</Button>
        <Button variant="primary" type="submit"style = {{float : "right"}}>
            Register
        </Button>
      </div>
  </Modal.Body>
  </Form>
  )
}

export default Login;