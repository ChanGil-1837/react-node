import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios'; 
const Main = (props) => {

    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:8080');
            setData(response.data.result);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }); // []를 두번째 인자로 주어서 한번만 호출되도록 함
    
    if(!data){
        const dummy = {
            title:"loading",
            content :"loading"
        }
        return <div className='Main'>
            <CardComp data = {dummy}/>
        </div>

    }
    return( 
        <div className='Main'>
            {data.map((item, index) => (
                <CardComp key={index} data={item} />
            ))}
        </div>
    )
}

const CardComp = (props) =>{
    return (
        <Card style={{ width: '18rem', float:"left"}}>
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