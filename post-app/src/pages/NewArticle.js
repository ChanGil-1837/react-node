import React, { useState } from 'react';
import '../NewArticle.css'; // CSS 파일을 import

const NewArticle = () => {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
        <button onClick={openModal}>글쓰기</button>
        {showModal && (
            <div className="ModalContainer" onClick={closeModal}>
            <div className="ModalWindow" onClick={e => e.stopPropagation()}>
                <div style={{ margin: "20px" }}>
                <h2>새 글 작성</h2>
                <textarea placeholder="내용을 입력하세요..." style={{ width: "100%", height: "200px" }}></textarea>
                <button onClick={closeModal} style={{ marginTop: "10px" }}>닫기</button>
                </div>
            </div>
            </div>
        )}
        </>
    );

};
export default NewArticle;

