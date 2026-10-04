import styles from "../styles/menus.module.scss";
import chevronDown from "../assets/svg/chevron-down-svgrepo-com.svg?url";

export function RadioMenu({name, label, items, radioState, menuClose}){
    const {menuOpen, setMenuOpen, selectedOption, handleRadioChange} = radioState;

    return(
        <>
        <div className={styles["dropdown-menu"]} id={styles[{name}]}>
            <span className={styles["textcontent"]}>{`${label}: `}</span>
            <button id={styles["sort-select"]} onClick={(event) => { event.stopPropagation(); menuClose(); setMenuOpen(isOpen => !isOpen); }}>
                <span>{selectedOption}</span>
                <img src={chevronDown} className={menuOpen ? styles["flipped"] : ""}/>
            </button>
            <div className={`${styles["menu"]} ${menuOpen ? styles["open"] : ""}`}>
                {items.map((item, index) => (
                    <button key={item} className={`${styles["radio"]} ${selectedOption === item ? styles["selected"] : ""} ${index === items.length - 1 ? styles["last-no-clear"] : ""}`} onClick={(event) => {event.stopPropagation(); handleRadioChange(item)}}>
                        <div></div>
                        <span>{item}</span>
                    </button>
                ))}
            </div>
        </div>
        </>
    )
}

export function CheckboxMenu({name, label, items, checkboxState, menuClose}){
    const {menuOpen, setMenuOpen, checkboxOptions, handleCheckboxChange} = checkboxState;

    return(
        <>
        <div className={styles["dropdown-menu"]} id={styles[{name}]}>
            <span className={styles["textcontent"]}>{`${label}: `}</span>
            <button id={styles["medium-select"]} onClick={(event) => { event.stopPropagation(); menuClose(); setMenuOpen(isOpen => !isOpen); }}>
                <span>{(checkboxOptions.empty || checkboxOptions.selected.length === items.length) ? `All ${label.toLowerCase()}` : (checkboxOptions.selected.length + " selected")}</span>
                <img src={chevronDown} className={menuOpen ? styles["flipped"] : ""}/>
            </button>
            <div className={`${styles["menu"]} ${menuOpen ? styles["open"] : ""}`}>
                {items.map((item, index) => (
                    <button key={item} className={`${checkboxOptions.selected?.includes(item) ? styles["selected"] : ""}`} onClick={(event) => { event.stopPropagation(); handleCheckboxChange(item); }}>
                        <div></div>
                        <span>{item}</span>
                    </button>
                ))}
                <button className={`${styles["last"]} ${checkboxOptions.empty ? styles["disabled"] : ""}`} onClick={(event) => { event.stopPropagation(); if (!checkboxOptions.empty) { handleCheckboxChange("clear"); } }}>
                    <span>Clear all</span>
                </button>
            </div>
        </div>
        </>
    )
}