import { useState } from 'react';


const Footer = () => {
  const [showRipple, setShowRipple] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
      setShowModal(true);
  };

  const closeModal = () => {
      setShowModal(false);
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

  return (
    <>
        <div className="floating-button" onClick={(e) => {handleRippleEffect(e); openModal();}}>
        <button>+</button>
        </div>
        <style jsx>{`
        .floating-button {
            position: fixed;
            bottom: 20px;
            right: 20px;

            z-index: 1000;
        }
        button {
            border: none;
            border-radius: 50%;
            padding: 10px 15px;
            background-color: #007bff;
            color: white;
            cursor: pointer;
            font-size: 24px;
            width: 60px;
            height : 60px;
        }
        `}</style>
        <style>{`
        .ripple {
            position: fixed;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            background: rgba(0, 123, 255, 0.5);
            animation: ripple-effect 0.6s linear;
        }
        @keyframes ripple-effect {
            from {
            transform: scale(1);
            opacity: 1;
            }
            to {
            transform: scale(100);
            opacity: 0;
            }
        }
        `}</style>
        {showRipple && (
        <div />
        )}
        {showModal && (
            <div className="ModalContainer" onClick={closeModal}>
            <div className="ModalWindow" onClick={e => e.stopPropagation()}>
                <div style={{ margin: "20px" }}>
                <h2>새 글 작성</h2>
                <textarea placeholder="내용을 입력하세요..." style={{ width: "100%", height: "200px" }}></textarea>
                <button onClick={closeModal} style={{ marginTop: "10px" }}>C</button>
                </div>
            </div>
            </div>
        )}
    </>
  );
};

export default Footer;