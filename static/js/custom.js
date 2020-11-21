document.addEventListener('readystatechange', event => {
    if (event.target.readyState === "interactive") {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches ||
            document.body.classList.contains("colorscheme-dark")) {
            let tweets = document.getElementsByClassName("twitter-tweet");
            for (const tweet of tweets) {
                tweet.setAttribute("data-theme", "dark")
            }
        }
    }
});