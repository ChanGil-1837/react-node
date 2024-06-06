import { useState, useRef, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const Footer = (props) => {
    const [showRipple, setShowRipple] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [file,setFile] = useState()
    const [errorMessage,setErrorMessage] = useState()

    const [value, setValue] = useState({
        title:"",
        content: "",
    })

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setErrorMessage(null)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(value.title == "") {
            setErrorMessage("Title is emtpy")
            return
        }
        if(value.content == "") {
            setErrorMessage("Content is emtpy")
            return
        }
        if(file == null) {
            setErrorMessage("Image is empty")
            return
        }
        
        try {
            var url = process.env.REACT_APP_SERVER_HOST + "/post"
            const formData = new FormData()
            formData.append("title", value.title)
            formData.append("content", value.content)
            formData.append("file", file)
		    
            const newData = {
                title : value.title,
                content : value.content,
                file : URL.createObjectURL(file)
            }
            setFile(null)
            
            axios({
                method:"post",
                url:url,
                data:formData,
                headers:{'Content-Type':'multipart/form-data'}
            }).then((res)=>{
                if (res.status == 200) {
                    props.handleAddData(newData)
                    closeModal()
                }
            }).catch((error) => {
                setErrorMessage("Your post count exceeded today.")
            })
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
    const onChangeImg = (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        
        if(e.target.files){
          const uploadFile = e.target.files[0]
          formData.append('file',uploadFile)
          setFile(uploadFile)
        }
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
                    {
                        errorMessage == "" ? <></> : <><span style={{ color: "red" }}><br></br><br></br>{errorMessage}</span></>
                    }
                    {
                        file != null ? <img src={URL.createObjectURL(file)} alt="preview" width="200" height="200"/> : null
                    }
                    <Form onSubmit={handleSubmit} method = "POST">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" name="title" placeholder="Title" maxLength={30} onChange={handleChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Contents</Form.Label>
                            <Form.Control as="textarea" name="content" placeholder='max length 300' rows={3} maxLength={300} onChange={handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="formFileSm" className="mb-3">
                            <Form.Label >Image File</Form.Label>
                            <Form.Control type="file" name='file' size="sm" onChange={onChangeImg} />
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
