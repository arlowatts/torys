// wait until the page loads
addEventListener("load", main);

showText = "Show spoilers";
hideText = "Hide spoilers";

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
            spoilerToggle.textContent = hideText;
            spoilerStyle.display = "";
        }
        else {
            spoilerHidden = true;
            spoilerToggle.textContent = showText;
            spoilerStyle.display = "none";
        }
    });

    // set the initial text content and show the button
    spoilerToggle.textContent = showText;
    spoilerToggle.style.display = "";
}

// access a stylesheet by the title attribute
function getStyleSheet(title) {
    for (const sheet of document.styleSheets)
        if (sheet.title === title)
            return sheet;
}
