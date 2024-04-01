import './App.css';
import { Button , Container, Nav, Navbar, NavbarBrand, NavDropdown, Row, Col, NavLink} from 'react-bootstrap';
import { useState } from 'react';

import {Routes, Route, Link, useNavigate } from "react-router-dom";

import data from "./data";
import Detail from './routes/Detail';
import Cart from './routes/Cart'
import axios from 'axios';
import { createContext } from 'react';
import { useQueries, useQuery } from 'react-query';

export let Context1 = createContext();


function App() {
  let [stock] = useState([10,11,12])
  let [shoes,setShoes] = useState(data);
  let navigate = useNavigate();

  let result = useQuery("data", () => 
    axios.get("https://codingapple1.github.io/userdata.json").then((a) => a.data)
  )

  return (
    <div className="App">
      <Navbar bg="light" variant='light'>
        <Container>
          <Navbar.Brand onClick={() => { navigate("/")}}>Shop</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={() => { navigate("/")}} >Home</Nav.Link>
            <Nav.Link onClick={() => { navigate("/cart")}}>Cart</Nav.Link>
          </Nav>
          <Nav className='ms-auto'> 
            { 
              result.isLoading ? 'Loading' : result.data.name
            }
          
          </Nav>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element = {
          <>
            <div className='main-bg'></div>
            <Container>
              <Row>
                {shoes.map((props,i)=> <Foo shoes= {shoes[i]} key = {i}/>)} 
              </Row>
            </Container>
            <button onClick={()=> {
              axios.get("https://codingapple1.github.io/shop/data2.json")
              .then((d) => {
                let copy = [...shoes, ...d.data];
                setShoes(copy);
              }).catch(() => {
                
              });
            }}>button</button>
          </>
        }/>
        <Route path="/detail/:id" element={
          <Context1.Provider value = {{stock,shoes}}><Detail shoes={shoes}/></Context1.Provider>
        }/>
        <Route path="/about" element={<About/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="*" element={<div>MISSING</div>}/>
      </Routes>
    </div>
  );
}

function About() {
  return (
    <>
      <h4>COMPANY INFO</h4>
    </>
  );
}

function Foo(props) {
  let navigate = useNavigate();
  let index = props.shoes.id + 1
  let imgsrc = "https://codingapple1.github.io/shop/shoes" + index+ ".jpg" ;
  return (
    <Col sm key = {props.key} >
      <Nav.Link onClick={() => { navigate("/detail/"+props.shoes.id)}}>
        <img src = {imgsrc} width="80%" ></img>
        <h4>{props.shoes.title}</h4>
        <p>{props.shoes.content}</p>
      </Nav.Link>
    </Col>
  );
}

export default App;
