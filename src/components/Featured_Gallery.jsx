import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
const MEDIA_SUBDOMAIN = "https://media.piras03.com";

const img_list = [
    MEDIA_SUBDOMAIN + "/image/dabcelebration/04.jpg",
    MEDIA_SUBDOMAIN + "/image/af2026/09.jpg",
    MEDIA_SUBDOMAIN + "/image/af2026/07.jpg",
    MEDIA_SUBDOMAIN + "/image/dabcelebration/05.jpg",
    MEDIA_SUBDOMAIN + "/image/digitalvol2/07.jpg",
    MEDIA_SUBDOMAIN + "/image/af2026/03.jpg",
    MEDIA_SUBDOMAIN + "/image/af2026/04.jpg",
    MEDIA_SUBDOMAIN + "/image/af2026/01.jpg",
    MEDIA_SUBDOMAIN + "/image/dabcelebration/03.jpg",
    MEDIA_SUBDOMAIN + "/image/digitalvol2/08.jpg",
    MEDIA_SUBDOMAIN + "/image/digitalvol2/02.jpg",
    MEDIA_SUBDOMAIN + "/image/digitalvol2/06.jpg",
    MEDIA_SUBDOMAIN + "/image/dabcelebration/02.jpg"
];

export function Featured_Gallery() {
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
            <ul className="gallery">
                {img_list.map((imgsrc) => <li key={imgsrc}>
                    <a href={imgsrc} onClick={(e) => { e.preventDefault(); setModal({ src: imgsrc, visible: true }); }}>
                        <img src={imgsrc} alt="" />
                    </a>
                </li>)}
            </ul>
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