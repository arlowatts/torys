// wait until the page loads
addEventListener("load", main);

function main() {
    let spoilerHidden = true;

    // access the toggle switch to show and hide spoilers
    const spoilerToggle = document.getElementById("spoiler-toggle");

    // access the style for the spoiler class
    const spoilerStyle = getStyleSheet("spoiler-style").cssRules[0].style;

    // set up the event listener for the toggle switch
    spoilerToggle.addEventListener("click", () => {
        if (spoilerHidden) {
            spoilerHidden = false;
            spoilerToggle.textContent = "Hide spoilers";
            spoilerStyle.display = "";
        }
        else {
            spoilerHidden = true;
            spoilerToggle.textContent = "Show spoilers";
            spoilerStyle.display = "none";
        }
    });
}

// access a stylesheet by the title attribute
function getStyleSheet(title) {
    for (const sheet of document.styleSheets)
        if (sheet.title === title)
            return sheet;
}
