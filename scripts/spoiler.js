let spoilerHidden = true;
const spoilerToggle = document.getElementById("spoiler-toggle");
const spoilerStyle = getStyleSheet("spoiler-style").cssRules[0].style;

spoilerToggle.addEventListener("click", () => {
    if (spoilerHidden) {
        spoilerHidden = false;
        spoilerToggle.textContent = "Hide spoilers";
        spoilerStyle.display = "initial";
    }
    else {
        spoilerHidden = true;
        spoilerToggle.textContent = "Show spoilers";
        spoilerStyle.display = "none";
    }
});

getStyleSheet(title) {
    for (const sheet of document.styleSheets)
        if (sheet.title === title)
            return sheet;
}
