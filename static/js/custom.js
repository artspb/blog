document.addEventListener('readystatechange', event => {
    if (event.target.readyState === "interactive") {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            let tweets = document.getElementsByClassName("twitter-tweet");
            for (const tweet of tweets) {
                tweet.setAttribute("data-theme", "dark")
            }
        }
    }
});