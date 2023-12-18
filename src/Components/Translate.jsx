import { useEffect } from "react";
import countries from "./data";

const Translate = () => {

    useEffect(() => {
        const fromText = document.querySelector(".from-text");
        const toText = document.querySelector(".to-text");
        const exchangeIcon = document.querySelector(".exchange");
        const selectTags = document.querySelectorAll("select");
        const icons = document.querySelectorAll(".row i");
        const translateBtn = document.querySelector("button");

        selectTags.forEach((tag, id) => {
            //   console.log(selectTag);
            for (let country_code in countries) {
                // console.log(country_code);
                let selected = id == 0 ?
                    country_code == "en-GB" ? "selected"
                        : ""
                    : country_code == "bn-IN" ? "selected"
                        : "";
                let option = `<option ${selected} value="${country_code}">
             ${countries[country_code]}</option>`
                tag.insertAdjacentHTML('beforeend', option);
            }

            exchangeIcon.addEventListener("click", () => {
                let tempText = fromText.value;
                // console.log(tempText);
                let tempLang = selectTags[0].value;
                // console.log(tempLang)
                fromText.value = toText.value;
                toText.value = tempText;
                selectTags[0].value = selectTags[1].value;
                selectTags[1].value = tempLang;

            })
            fromText.addEventListener("keyup", () => {

                if (!fromText.value) {
                    toText.value = "";
                }
            });
        });
        translateBtn.addEventListener("click", () => {
            let text = fromText.value.trim();
            let translateForm = selectTags[0].value;
            let translateTo = selectTags[1].value;
            // console.log(text)
            // console.log(translateForm)
            // console.log(translateTo)
            if (!text) return;
            toText.setAttribute("placeholder", "Translatng ...");

            let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateForm}|${translateTo}`
            fetch(apiUrl)
                .then((res) => res.json())
                .then((data) => {
                    console.log(data)
                    toText.value = data.responseData.translatedText;
                })
            toText.setAttribute("placeholder", "Translation");
        })

        icons.forEach((icon) => {
            icon.addEventListener('click', ({ target }) => {
                if (!fromText.value || !toText.value) return;
                if (target.classList.contains('fa-copy')) {
                    if (target.id === "from") {
                        navigator.clipboard.writeText(fromText.value);
                    } else {
                        navigator.clipboard.writeText(toText.value);
                    }
                } else {
                    let utterance;
                    if (target.id == "from") {
                        utterance = new SpeechSynthesisUtterance(fromText.value);
                        utterance.lang = selectTags[0].value;

                    } else {
                        utterance = new SpeechSynthesisUtterance(toText.value);
                        utterance.lang = selectTags[1].value;
                    }
                    speechSynthesis.speak(utterance)

                }
            })
        })
    }, []);

    return (
        <div className="container">
            <div className="wrapper">
                <div className="text-input flex flex-col md:flex-row pl-6 pr-6 ">
                    <textarea
                        spellCheck="false"
                        className="from-text flex-grow mb-4 md:mb-0 md:mr-2"
                        placeholder="Enter text here ....">
                    </textarea>
                    <textarea 
                        readOnly
                        spellCheck="false"
                        className="to-text flex-grow"
                        placeholder="translation">
                    </textarea>
                </div>
                <ul className="controls flex justify-between">
                    <li className="row flex from">
                        <div className="icons">
                            <i id="from" className="fas fa-volume-up cursor-pointer" />
                            <i id="from" className="fas fa-copy cursor-pointer" />
                        </div>
                        <select></select>
                    </li>
                    <li className="exchange">
                        <i className="fas fa-exchange-alt cursor-pointer" />
                    </li>
                    <li className="row flex to">
                        <select></select>
                        <div className="icons">
                            <i id="to" className="fas fa-volume-up cursor-pointer" />
                            <i id="to" className="fas fa-copy cursor-pointer" />
                        </div>
                    </li>
                </ul>

            </div>
            <button>Translate Text</button>
        </div>
    );
};

export default Translate;