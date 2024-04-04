import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios'; 
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Main = (props) => {

    useEffect(() => {
        const fetchData = async () => {
          try {
            let response = await axios.get(process.env.REACT_APP_SERVER_HOST+'/main');
            props.handleData(response.data.result)

          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData(); // fetchData 함수 호출
    },[] );

    if(!props.data || props.data.length <1 ){
        return <></>
    }

    return( 
        <div className='Main'>
            {props.data.map((item, index) => (
                <CardComp style={{}} key={index} data={item} id = {props.id} handleDelete={() => props.handleDelete(item._id,item.filekey)}/>
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