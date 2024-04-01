import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios'; 

const Main = (props) => {

    const [data, setData] = useState(null);

 
    useEffect(() => {
        let timer
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:8080');
            let D = response.data.result;
            timer = setTimeout(() => {
                setData(prevListData => {
                    // data 배열에서 다음 아이템을 가져옵니다.
                    const nextIndex = (prevListData?.length || 0) % D.length;
                    
                    return [...(prevListData || []), D[nextIndex]];
                });
            }, 500);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };

        fetchData();
        return () => {
            clearTimeout(timer);
            setData(null)
        }
    },[]); // []를 두번째 인자로 주어서 한번만 호출되도록 함

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
        <Card style={{ width: '18rem', float:"left", animation: "slideIn 0.5s ease-out"}}>
            <Card.Img variant="top" src="images/temp.png" />
            <div style={{textAlign:"right", paddingRight:"30px"}}>♥️</div>
            <Card.Body>
                <Card.Title>{props.data.title}</Card.Title>
                <Card.Text>
                    {props.data.content}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Main;