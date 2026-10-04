import { memo, useEffect, useState, useReducer, useTransition, useCallback, useMemo} from 'react';
import {CheckboxMenu, RadioMenu} from '../components/Menus.jsx';
import styles from "../styles/art.module.scss";
import { navigate } from "astro:transitions/client";
import { createPortal } from "react-dom";
import leftChevron from "../assets/svg/chevron-left-svgrepo-com.svg?url";
import rightChevron from "../assets/svg/chevron-right-svgrepo-com.svg?url";

const MEDIA_SUBDOMAIN = import.meta.env.PUBLIC_MEDIA_DOMAIN;
const DOMAIN = import.meta.env.SITE;

const artGalleryFiles = Object.values(
    import.meta.glob("../assets/json/collection_list/*.json", { eager: true, import: "default" })
);

const mediumList = Array.from(new Set(artGalleryFiles.flatMap(file => file.mediums))).sort();

const tagList = Array.from(new Set(artGalleryFiles.flatMap(file => file.tags))).sort();

const CheckboxState = {
    selected: null,
    empty: true
};

const handleMenuOptionChange = (state, action) => {
        if (action === "clear") {
            return{
                ...state,
                selected: null,
                empty: true
            }
        }
        if (state.empty) {
            return{
                ...state,
                selected: [action],
                empty: false
            };
        }
        if (state.selected.includes(action)) {
            if (state.selected.length === 1) {
                return{
                    ...state,
                    selected: null,
                    empty: true
                };
            }
            else {
                return{
                    ...state,
                    selected: state.selected.filter(item => item !== action)
                };
            }
        }
        else {
            return{
                ...state,
                selected: [...state.selected, action]
            };
        }
    }


export default function GalleryPage() {
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [mediumMenuOpen, setMediumMenuOpen] = useState(false);
    const [tagMenuOpen, setTagMenuOpen] = useState(false);
    const [sortOption, setSortOption] = useState("Newest first");
    const [mediumOption, setMediumOption] = useReducer(handleMenuOptionChange, CheckboxState, () => CheckboxState);
    const [tagOption, setTagOption] = useReducer(handleMenuOptionChange, CheckboxState, () => CheckboxState);
    const [isPending, startTransition] = useTransition();

    const closeAllMenus = useCallback((type) => {
        switch (type) {
            case "sort-select":
                setMediumMenuOpen(false);
                setTagMenuOpen(false);
                break;
            case "medium-select":
                setSortMenuOpen(false);
                setTagMenuOpen(false);
                break;
            case "tag-select":
                setSortMenuOpen(false);
                setMediumMenuOpen(false);
                break;
            default:
                setSortMenuOpen(false);
                setMediumMenuOpen(false);
                setTagMenuOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('click', closeAllMenus);

        return () => document.removeEventListener('click', closeAllMenus);
    }, []);
    
    const handleSortOptionChange = (option) => {
        startTransition(() => {
            setSortOption(option);
        });
        closeAllMenus("sort-select");
    }

    const handleMediumOptionChange = (option) => {
        startTransition(() => {
            setMediumOption(option);
        });
    };

    const handleTagOptionChange = (option) => {
        startTransition(() => {
            setTagOption(option);
        });
    };

    const galleryKey = [
        sortOption,
        mediumOption.selected?.join("|") ?? "all-mediums",
        tagOption.selected?.join("|") ?? "all-tags"
    ].join("::");

    const sortMenuState = useMemo(() => ({
        menuOpen: sortMenuOpen,
        setMenuOpen: setSortMenuOpen,
        selectedOption: sortOption,
        handleRadioChange: handleSortOptionChange
    }), [sortMenuOpen, sortOption]);

    const mediumMenuState = useMemo(() => ({
        menuOpen: mediumMenuOpen,
        setMenuOpen: setMediumMenuOpen,
        checkboxOptions: mediumOption,
        handleCheckboxChange: handleMediumOptionChange
    }), [mediumMenuOpen, mediumOption]);

    const tagMenuState = useMemo(() => ({
        menuOpen: tagMenuOpen,
        setMenuOpen: setTagMenuOpen,
        checkboxOptions: tagOption,
        handleCheckboxChange: handleTagOptionChange
    }), [tagMenuOpen, tagOption]);

    return (
        <>
            <div id={styles["section-0"]}>
                <RadioMenu name="sort-menu" label="Sort" items={["Newest first", "Oldest first"]} radioState={sortMenuState} menuClose={() => closeAllMenus("sort-select")}/>
                <CheckboxMenu name="mediums-menu" label="Mediums" items={mediumList} checkboxState={mediumMenuState} menuClose={() => closeAllMenus("medium-select")}/>
                <CheckboxMenu name="tags-menu" label="Tags" items={tagList} checkboxState={tagMenuState} menuClose={() => closeAllMenus("tag-select")}/>
            </div>
            <div id={styles["section-1"]} aria-busy={isPending}>
                <DisplayArtGalleryFiles key={galleryKey} sortOption={sortOption} mediumOption={mediumOption} tagOption={tagOption}/>
            </div>
        </>
    );
}

function sortFiles(files, sortOption) {
    return [...files].sort((a, b) => {
        const dateDifference = new Date(a.date) - new Date(b.date);
        return sortOption === "Newest first" ? -dateDifference : dateDifference;
    });
}

function applyFilters(files, mediumOption, tagOption) {
    return files.filter(file => {
        const matchesMedium = mediumOption.empty || file.mediums.some(medium => mediumOption.selected.includes(medium));
        const matchesTag = tagOption.empty || file.tags.some(tag => tagOption.selected.includes(tag));
        return matchesMedium && matchesTag;
    });
}

const DisplayArtGalleryFiles = memo(function DisplayArtGalleryFiles({ sortOption, mediumOption, tagOption }) {
    const [modalInfo, setModal] = useState({ collectionhandle: null, visible: false });
    const files = useMemo(() => sortFiles(
        applyFilters(artGalleryFiles, mediumOption, tagOption),
        sortOption
    ), [sortOption, mediumOption, tagOption]);

    const handleModalView = useCallback((collectionhandle) => {
        setModal({ collectionhandle, visible: true });
        history.pushState({}, "", `/art/${collectionhandle}`);
    }, []);

    return (
        <>
        {files.map((file) => (
            <a className={styles["card"]} href={`/art/${file.handle}`} key={file.handle} onClick={(e) => {e.preventDefault(); handleModalView(file.handle);}}>
                <div className={styles["img-container"]}>
                    <img src={MEDIA_SUBDOMAIN + "/image/" + file.handle + "/" + file["thumbnail-id"] + ".jpg"} />
                </div>
                <div className={styles["title-date"]}>
                    <h1>{file.title}</h1>
                    <time className={styles["date"]} dateTime={file.date}>
                        {new Date(file.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </time>
                </div>
                <div className={styles["medium-tags"]}>
                    {file.mediums.map((medium, index) => (
                        <span key={medium}>{medium}</span>
                    ))}
                    {file.tags.map((tag, index) => (
                        <span key={tag}>{tag}</span>
                    ))}
                </div>
            </a>
        ))}
            <CollectionModal
                modalInfo={modalInfo}
                setModal={setModal}
            />
        </>
    );
});

//history.pushState({prevURL: window.location.pathname}, "", window.location.pathname);
//navigate(`/art/${file.handle}`, { state: { prevURL: window.location.pathname } });

const carouselState = {
    currentIndex: 0,
    drawings: []
}

function initialCarouselState(collection) {
    return {
        currentIndex: (parseInt(collection["thumbnail-id"]) - 1) || 0,
        drawings: collection.drawings || []
    };
}

function CarouselLogic(state, action) {
    if (action.type === "reset") {
        return initialCarouselState(action.collection);
    }

    const totalDrawings = state.drawings.length;
    switch (action.type ?? action) {
        case "next":
            return {
                ...state,
                currentIndex: (state.currentIndex + 1) % totalDrawings
            };
        case "prev":
            return {
                ...state,
                currentIndex: (state.currentIndex - 1 + totalDrawings) % totalDrawings
            };
        default:
            return state;
    }
}

function CollectionModal({ modalInfo, setModal }) {
    const [bodyElement, setBodyElement] = useState(null);
    const collection = artGalleryFiles.find(file => file.handle === modalInfo.collectionhandle);

    useEffect(() => {
        setBodyElement(document.body);
    }, []);

    useEffect(() => {
        const htmlElement = document.documentElement;
        const hasVerticalScrollbar = htmlElement.scrollHeight > htmlElement.clientHeight;
        if (bodyElement) {
            bodyElement.style.overflow = modalInfo.visible ? "hidden" : "auto";
            if(hasVerticalScrollbar){
                const bodyBackgroundColor = htmlElement.getAttribute("data-theme") === "dark" ? "#07070a" : "#3a3c43";
                bodyElement.style.setProperty("--body-background-color", modalInfo.visible ? bodyBackgroundColor : "");
                htmlElement.style.scrollbarGutter = modalInfo.visible ? "stable" : "auto";
            }
        }
    }, [bodyElement, modalInfo.visible]);

    if (!bodyElement) {
        return null;
    }

    if (!collection) {
        return createPortal(
            <>
                <div id={styles["modal-view"]} className={modalInfo.visible ? styles["visible"] : styles["hidden"]}>
                    <div id={styles["modal-view-sub"]}>
                        <div className={styles["title-date"]}>
                            <h1>Collection not found</h1>
                            <time className={styles["date"]}>
                            </time>
                        </div>
                    </div>
                </div>
            </>
        , bodyElement);
    }

    const handleModalClose = () => {
        setModal((previousState) => ({ ...previousState, visible: false }));
        history.pushState({}, "", "/art");
    }

    return createPortal(
        <>
            <div id={styles["modal-view"]} className={modalInfo.visible ? styles["visible"] : styles["hidden"]} onClick={(event) => { if (event.target.id === styles["modal-view"]) { handleModalClose(); } }}>
                <div id={styles["modal-view-sub"]}>
                    <div className={styles["title-date"]}>
                        <h1>{collection.title}</h1>
                        <time className={styles["date"]} dateTime={collection.date}>
                            {new Date(collection.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </time>
                    </div>
                    <div className={styles["medium-tags"]}>
                        {collection.mediums.map((medium, index) => (
                            <span key={index}>{medium}</span>
                        ))}
                        {collection.tags.map((tag, index) => (
                            <span key={index}>{tag}</span>
                        ))}
                    </div>
                    <CollectionCarousel collection={collection} visible={modalInfo.visible} styles={styles} />
                </div>
            </div>
        </>
    , bodyElement);
}

function CollectionCarousel({ collection, visible, styles }){
    const [cState, setCState] = useReducer(CarouselLogic, carouselState, () => initialCarouselState(collection));

    useEffect(() => {
        setCState({ type: "reset", collection });
    }, [collection, visible]);

    if (!cState.drawings.length) {
        return null;
    }

    return(
        <>
        <div className={styles["img-carousel"]}>
            <img src={MEDIA_SUBDOMAIN + "/image/" + collection.handle + "/" + cState.drawings[cState.currentIndex].id + ".jpg"} alt={collection.title} />
            <button type="button" className={styles["left"]} aria-label="Previous image" onClick={() => setCState("prev")}>
                <img src={leftChevron} alt="Previous"/>
            </button>
            <button type="button" className={styles["right"]} aria-label="Next image" onClick={() => setCState("next")}>
                <img src={rightChevron} alt="Next"/>
            </button>
        </div>
        <div className={styles["drawing-info"]}>
            <div className={styles["title-date"]}>
                <h1>{cState.drawings[cState.currentIndex].title}</h1>
                <time className={styles["date"]} dateTime={cState.drawings[cState.currentIndex].date}>
                    {new Date(cState.drawings[cState.currentIndex].date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </time>
            </div>
            <p>{cState.drawings[cState.currentIndex].caption}</p>
        </div>
        </>
    );
}