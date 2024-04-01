import { useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const Footer = () => {
    const [showRipple, setShowRipple] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [value, setValue] = useState({
        title:"",
        contents: "",
        file:""
    })

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("aa")
        try {
          var post = "http://localhost:8080/post"
          const response = await axios.post(post, value);
          if( response.status == 200 ) {
            closeModal()
          }
        } catch (error) {
          console.log("error", error);
        }
    };


    const handleRippleEffect = (event) => {
    setShowRipple(true);
    const ripple = document.createElement("div");
    ripple.className = "ripple";
    document.body.appendChild(ripple);
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
    ripple.style.animation = "ripple-effect 0.6s linear";
    ripple.onanimationend = () => {
        setShowRipple(false);
        ripple.remove();
    };
    };
    const handleChange = e => {
        setValue({
            ...value,
            [e.target.name] : e.target.value,
        })
    }
    return (
    <>
        <div className="floating-button" onClick={(e) => {handleRippleEffect(e); openModal();}}>
        <Button className="footerButton" style={{borderRadius: "50%"}}>+</Button>
        </div>
        {showRipple && (
        <div />
        )}
        {showModal && (
            <div className="ModalContainer" onClick={closeModal}>
            <div className="ModalWindow" onClick={e => e.stopPropagation()}>
                <div style={{ margin: "20px" }}>
                    <h2>New Article</h2>
                    <Form onSubmit={handleSubmit} method = "POST">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" name="title" placeholder="Title" maxLength={30} onChange={handleChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Contents</Form.Label>
                            <Form.Control as="textarea" name="contents" placeholder='max length 300' rows={3} maxLength={300} onChange={handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="formFileSm" className="mb-3">
                            <Form.Label >Image File</Form.Label>
                            <Form.Control type="file" name='file' size="sm" onChange={handleChange} />
                        </Form.Group>
                        <div style={{display:"flex", flexDirection:"row", justifyContent:"flex-end"}}>
                            <Button variant="secondary" style={{textAlign:"center"}} active onClick={closeModal}>
                                Cancle
                            </Button>
                            <div style={{width:"10px"}}></div>
                            <Button variant="primary" type="submit">
                                Post
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
            </div>
        )}
    </>
    );
};

export default Footer;