import { useEffect, useState } from "react";
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

function Featured_Gallery() {
    const [modalInfo, setModal] = useState({ src: null, visible: false });

    useEffect(() => {
        document.body.style.overflow = modalInfo.visible ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
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
            <div
                id="modal-view"
                className={modalInfo.visible ? "visible" : ""}
                onClick={() => setModal((previousState) => ({ ...previousState, visible: false }))}
            >
                <img src={modalInfo.src} alt=""/>
            </div>
        </>
    );
}

export default Featured_Gallery;