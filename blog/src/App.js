import { useState } from 'react';
import './App.css';

function App() {


  let [title, changetitle] = useState(["남자 코트 추천","강남 우동 맛집","파이썬 독학"]);
  let [like, likefunc] = useState(0)

  let [modal, setModal] = useState(false);
  let [index, setIndex] = useState(0);
  let [input, setInput] = useState("");
  return (
    <div className="App">
      <div className = "black-nav">
        <h4>BLOG</h4>
      </div>
      {
        title.map((val,i) =>{
          return (<div className='list' key = {i}>
            <h4 onClick={() =>{ setModal(!modal);  setIndex(i)}}>{val} </h4><span onClick={ (e) => { e.stopPropagation(); likefunc( like++ ) } }>👍</span> {like} 
            <p>Date</p>
          </div>)
        })
      }
      <input onInput={(e) => {setInput(e.target.value)}}></input>
      <button onClick={() =>{ let copy = [...title]; copy.push(input); changetitle(copy)}}>입력</button>
      {
        modal ? <Modal i = {index} changetitle = {changetitle} color = {"skyblue"} value = {title}/> : null
      }
      
    </div>
  );
}

function Modal(props) {
  return (
    <div className= "modal" style= {{background: props.color}}>
      <h4>{props.value[props.i]}</h4>
      <p>날짜</p>
      <p>상세내용</p>
      <button onClick={() => {}}>글수정</button>
    </div>
  )
}

export default App;
