import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios'; 
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Main = (props) => {

    const [data, setData] = useState(null);
    const handleDelete = async (id,key) => {
        // id와 일치하지 않는 요소만 필터링하여 새로운 배열을 만듭니다.
        console.log(key)
        const newData = data.filter(item => item._id !== id);
        setData(newData); // 새로운 배열을 상태로 설정하여 렌더링합니다.
        try{
            await axios.delete('http://localhost:8080/delete/'+id)

        }catch(error) {
            console.error('Error deleting data:', error);
        }
    };
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



    if(!data){
        return <></>
    }

    return( 
        <div className='Main'>
            {data.map((item, index) => (
                <CardComp style={{}} key={index} data={item} id = {props.id} handleDelete={() => handleDelete(item._id,item.filekey)}/>
            ))}
        </div>
    )
}





const CardComp = (props) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleDelete = async (id) => {
        props.handleDelete(id)
        handleClose()
        
    }


    return (
        <>
            <Card 
            onClick={() =>{handleShow();}}
            style={{ 
                width: '20rem', 
                float:"left", 
                cursor: "pointer",
                padding:"10px", 
                margin:"10px"
            }}>
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

            <Modal show={show} onHide={handleClose} animation={true} className="ModalWindow" style={{marginLeft:"10%", maxWidth:"80%", borderRadius:"10px", overflow:"auto"}} >
                <Modal.Header closeButton>
                    <Modal.Title>{props.data.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.data.fileUrl != "" ? <img src={props.data.fileUrl} alt="content" style={{width: '100%'}} /> : <img src="images/temp.png" alt="default" style={{width: '100%'}} />}
                    <p>{props.data.content}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={() => alert('좋아요!')}>Like!</Button>
                    <div style={{textAlign:"right", width: '100%'}}>{props.data.nickname} {props.data.date}</div>
                    {
                        props.data.userId == props.id ? <Button variant="outline-danger" size = "sm"onClick={() => handleDelete()}>delete</Button> : <></>
                    }
                    
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Main;