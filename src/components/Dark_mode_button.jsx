import moonIcon from "../assets/svg/moon-stars-svgrepo-com.svg?url";
import sunIcon from "../assets/svg/sun-svgrepo-com.svg?url";
import "../styles/dmbutton.scss"

function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
}

function Dark_mode_button() {
    return (
        <button id="toggledarkmode" type="button" aria-label="Toggle color theme" onClick={() => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            setTheme(currentTheme === "dark" ? "light" : "dark");
        }}>
            <div>
                <img id="dark" src={moonIcon} alt="" />
                <img id="light" src={sunIcon} alt="" />
            </div>
        </button>
    );
}

export default Dark_mode_button;