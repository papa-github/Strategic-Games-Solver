import React, { useState } from "react";
import "../styles/modalStyle.css"

export default function ImageModal (props: {text: string, image: string}) {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
        <div style={{ display: "inline" }}>
            <button className="modal-button" onClick={toggleModal}>{props.text}</button>
            <div className="modal" style={{ display: showModal ? "flex" : "none" }}>
                <div className="modal-content">
                <button className="close-button" onClick={toggleModal}>
                    X
                </button>
                <img src={props.image} alt="Example of a left-to-right tree" className="modal-image" />
                </div>
            </div>
        </div>
    );
};

