import './App.css';
import axios from 'axios';
import React,{useState,useEffect, useRef} from 'react';
import {Nav,Navbar, Container, NavDropdown } from 'react-bootstrap';
import { Route, Routes,useNavigate,Redirect} from 'react-router-dom';
import Main from "./pages/Main";
import Login from './pages/Login';
import Logout from "./pages/Logout";

function App() {

  let [modalOpenLogin, setModalOpenLogin] = useState(false);
  let [userId,setUserId] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080');
        // userId 상태가 업데이트되면 메시지를 설정
        if (response.data.username === null || response.data.username == "") {
          setUserId("");
        } else {
          setUserId(response.data.username);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData(); // fetchData 함수 호출
  }, );

  return (
    <div className="App">
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand onClick={() => { navigate("/")}}>Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#Favorites">Favorites</Nav.Link>
          </Nav>
          {
            userId == "" ?
          <Nav className='ms-auto' style={{paddingRight:"50px"}}>
            <Nav.Link onClick={() => setModalOpenLogin(!modalOpenLogin)}>Login</Nav.Link>
          </Nav> :
          <>
          <Nav>
            <NavDropdown
              id="nav-dropdown-dark-example"
              title={userId}
              menuVariant="dark"
              bsPrefix='custom-dropdown'
            >
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => { navigate("/logout")}}>
                Log out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          </>
          }
        </Container>
      </Navbar>
      <Routes>
        <Route path = "/" element = {<Main></Main>}></Route>
        <Route path = "/logout" element = {<Logout/>}></Route>
        <Route path = "*" element={<div>MISSING</div>}/>
      </Routes>
      <Login show = {modalOpenLogin} onHide = {() => setModalOpenLogin(false)}  setUserId = {(e) => {setUserId(e)}}></Login>
    </div>
  );
}

export default App;