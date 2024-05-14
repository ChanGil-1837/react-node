import './App.css';
import axios from 'axios';
import React,{useState,useEffect, useRef} from 'react';
import {Nav,Navbar, Container, NavDropdown } from 'react-bootstrap';
import { Route, Routes,useNavigate,Redirect} from 'react-router-dom';
import Main from "./pages/Main";
import Login from './pages/Login';
import Logout from "./pages/Logout";
import Footer from "./pages/Footer";
import './NewArticle.css'; // CSS 파일을 import
import MyPosts from './pages/MyPosts';

function App() {

  let [modalOpenLogin, setModalOpenLogin] = useState(false);
  let [data, setData] = useState(null);
  let [userId,setUserId] = useState("");
  let navigate = useNavigate();
  let [id, setId] = useState("");

  const handleDelete = async (id) => {
    const newData = data.filter(item => item._id !== id);
    setData(newData); // 새로운 배열을 상태로 설정하여 렌더링합니다.
    try{
        await axios.delete(process.env.REACT_APP_SERVER_HOST+'/delete/'+id)

    }catch(error) {
        console.error('Error deleting data:', error);
    }
  };

  const handleData = async (data) => {
    setData(data)
  }
  const handleAddData = async (newData) => {
    // 이전 데이터 배열 복사
    const newDataArray = [...data];
    
    // 새로운 객체 생성
    const newObject = {
      title: newData.title,
      contents: newData.contents,
      fileUrl: newData.file
    };
    // 새로운 객체를 데이터 배열에 추가
    newDataArray.push(newObject);
  
    // 데이터 배열 업데이트
    setData(newDataArray);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_SERVER_HOST+"/");
        // userId 상태가 업데이트되면 메시지를 설정
        if (response.data.username === null || response.data.username == "") {
          setUserId("");
        } else {
          setUserId(response.data.username);
          setId(response.data._id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData(); // fetchData 함수 호출
  },[data] );

  return (
    <div className="App">
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand onClick={() => { navigate("/")}}>Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={() => { navigate("/")}}>Home</Nav.Link>
            
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
              <NavDropdown.Item onClick={() => {navigate("/myposts")}}>My Posts</NavDropdown.Item>
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
        <Route path = "/" element = {<Main id = {id} data = {data} handleDelete={handleDelete} handleData={handleData}></Main>}></Route>
        <Route path = "/logout" element = {<Logout/>}></Route>
        <Route path = "/myposts" element={<MyPosts id = {id} data = {data} handleDelete={handleDelete} handleData={handleData}></MyPosts>}/>
        <Route path = "*" element={<div>MISSING</div>}/>
      </Routes>
      <Login show = {modalOpenLogin} onHide = {() => setModalOpenLogin(false)}  setUserId = {(e) => {setUserId(e)}}></Login>
      {userId == "" ?
      <></>:
      <Footer handleAddData={handleAddData}></Footer>
      }
    </div>
  );
}


export default App;
