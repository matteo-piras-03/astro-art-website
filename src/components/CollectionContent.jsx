import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
const MEDIA_SUBDOMAIN = import.meta.env.PUBLIC_MEDIA_DOMAIN;

function formatDate(dateString, short = false) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: short ? "short" : "long",
    day: "numeric",
  });
}

function returnDrawingSrc(collection, drawingId) {
  return MEDIA_SUBDOMAIN + "/image/" + collection + "/" + drawingId + ".jpg";
}

export default function CollectionContent({ drawings, collection }) {
    const [modalInfo, setModal] = useState({ src: null, visible: false });

    useEffect(() => {
        const htmlElement = document.documentElement;
        const hasVerticalScrollbar = htmlElement.scrollHeight > htmlElement.clientHeight;

        document.body.style.overflow = modalInfo.visible ? "hidden" : "auto";
        if(hasVerticalScrollbar){
            const bodyBackgroundColor = htmlElement.getAttribute("data-theme") === "dark" ? "#07070a" : "#3a3c43";
            document.body.style.setProperty("--body-background-color", modalInfo.visible ? bodyBackgroundColor : "");
            htmlElement.style.scrollbarGutter = modalInfo.visible ? "stable" : "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
            htmlElement.style.scrollbarGutter = "auto";
        };
    }, [modalInfo.visible]);
    return (
        <>
        {drawings.map((drawing) => (
          <a key={drawing.id} href={returnDrawingSrc(collection, drawing.id)} className="drawing-card" onClick={(e) => { e.preventDefault(); setModal({ src: returnDrawingSrc(collection, drawing.id), visible: true }); }}>
            
            <img src={returnDrawingSrc(collection, drawing.id)} alt={drawing.title} />
            <div className="title-date"><h1>{drawing.title}</h1><span className="date">{formatDate(drawing.date, true)}</span></div>
            <p>{drawing.caption}</p>
            
          </a>
        ))}
        <Gallery_Modal modalInfo={modalInfo} setModal={setModal} />
        </>
    );
}

export function Gallery_Modal({ modalInfo, setModal }) {
    const [bodyElement, setBodyElement] = useState(null);

    useEffect(() => {
        setBodyElement(document.body);
    }, []);

    if (!bodyElement) {
        return null;
    }

    return(
        createPortal(
            <div
                id="modal-view"
                className={`${modalInfo.visible ? "visible" : ""}`}
                onClick={() => setModal((previousState) => ({ ...previousState, visible: false }))}
            >
                <img src={modalInfo.src} alt=""/>
            </div>,
            bodyElement
        )
    );
}