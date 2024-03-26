import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {Nav} from "react-bootstrap";
import {Context1} from "../App"

function Detail(props) {

    
    let [nowScreen, setScreen] = useState(0);
    let [count, setCount] = useState(5);
    useEffect(() => {
        setTimeout(() => {
            
        }, 5000);
    },[count]);

    let {id} = useParams();
    let obj = props.shoes.find(x => x.id == id);
    let index = Number(obj.id)+1;
    
    return (
        <div className="container">
            <div className="alert alert-warning">
                {count}초 이내 구매시 할인
            </div>
            <div className="row">
                <div className="col-md-6">
                    <img src = {"https://codingapple1.github.io/shop/shoes" + index + ".jpg"} width="100%"/>                    
                </div>
                <div className="col-md-6 mt-4">
                    <h4 className="pt-5">{obj.title}</h4>
                    <p>{obj.content}</p>
                    <p>{obj.price}</p>

                    <button className="btn btn-danger">주문하기</button>
                </div>
            </div>
            <Nav variant="tabs" defaultActiveKey="link0">
                <Nav.Item>
                    <Nav.Link eventKey="link0" onClick={() => { setScreen(0); }}>link0</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link1"onClick={() => { setScreen(1); }}>link1</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link2"onClick={() => { setScreen(2); }}>link2</Nav.Link>
                </Nav.Item>
            </Nav>
            <Tab nowScreen = {nowScreen}></Tab>
            
        </div>
    );
}
function Tab(props) {
    let {stock, shoes} = useContext(Context1);
    let [fade, setFade] = useState('');
    useEffect(() =>{
        setTimeout(() => {
            setFade("end");    
        }, 100);
        return () => {
            setFade("");
        }
    }, [props.nowScreen]) 

    return (<div className={"start "+ fade}>{
        [<div>1{stock[0]}</div>,<div>2</div>,<div>4</div>][props.nowScreen]
    }</div>);
}
export default Detail;