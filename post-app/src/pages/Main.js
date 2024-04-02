import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios'; 

const Main = (props) => {

    const [data, setData] = useState(null);

    useEffect(() => {
        let timer = null; // 타이머 변수 초기화
    
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080');
                const fetchedData = response.data.result;
                setData(fetchedData)
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    
        return () => {
            if (timer) {
                clearInterval(timer); // 현재 실행 중인 타이머만 중지합니다.
                timer = null; // 타이머 변수 초기화
            }
        };
    }, []); // []를 두번째 인자로 주어서 한번만 호출되도록

 // data가 변경될 때마다 실행됨

    if(!data){
        return <></>
    }

    return( 
        <div className='Main'>
            {data.map((item, index) => (
                <CardComp style={{}} key={index} data={item} />
            ))}
        </div>
    )
}


const CardComp = (props) =>{
    return (
        <Card style={{ width: '20rem', float:"left", animation: "slideIn 0.5s ease-out", padding:"10px", margin:"10px"}}>
            {props.data.fileUrl != "" ? <Card.Img variant="top" src={props.data.fileUrl} /> : <Card.Img variant="top" src="images/temp.png" />}
            <div style={{textAlign:"right", paddingRight:"30px"}}>♥️</div>
            <Card.Body>
                <Card.Title>{props.data.title}</Card.Title>
                <Card.Text>
                    {props.data.content}
                </Card.Text>
                <div style={{float:"right", fontSize:"10px"}}>{props.data.nickname} {props.data.date}</div>
            </Card.Body>
        </Card>
    )
}

export default Main;