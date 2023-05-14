/* By Zachary A. Miller */

const url_params = new URLSearchParams(window.location.search);
const search_query = filter_search_query(url_params.get("q"));
const keywords = search_query.split(" ");

var search_items;

$.ajax({
    url: '/Search/search_items.json',
    type: 'GET',
    success: data => {
        search_items = data;
    }
});

function filter_search_query(query) {
    if(query) {
        return query.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "");
    }

    return "";
}

function get_score(item) {
    let score = 0;

    for(const [tag, scoring_value] of Object.entries(item.tags)) {
        if(search_query.includes(tag)) {
            score += scoring_value;
        }
    }

    let found_words = []
    let html_tags = ["h1", "h2", "h3", "h4", "h5", "h6", "a", "p", "i", "b", "span"];
    html_tags.forEach(html_tag => {
        item.content.querySelectorAll(html_tag).forEach(element => {
            keywords.forEach(keyword => {
                if(!found_words.includes(keyword) && element.innerText.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").includes(" " + keyword + " ")) {
                    found_words.push(keyword);
                    score += 1;
                    return;
                }
            });
        });
    });

    return score;
}

function get_search_results() {
    let results = {};

    for([path, data] of Object.entries(search_items)) {
        let score = get_score(data);

        if(score > 0) {
            results[path] = data;
        }

        search_items[path].score = score;
    }

    return results;
}

function attempt_load() {
    const result_template = document.getElementById("search-result-template");

    try {
        for(const [href, _] of Object.entries(search_items)) {
            search_items[href].href = href;
           
            $.ajax({
                url: href,
                type: 'GET',
                success: data => {
                    let content = document.createElement("div");
                    content.innerHTML = data.substring(data.indexOf("<body>") + 6);
        
                    search_items[href].content = content;
                    $("#loaded-content").append(content);
                    search_items[href].loaded = true;
                }
            });
        }

        document.getElementById("search-results").innerHTML = "";

        let results = get_search_results();
        let scores = Object.keys(results).map(key => {
            return [key, results[key].score];
        });

        scores.sort((first, second) => {
            return second[1] - first[1];
        });

        scores.forEach((result, i) => {
            let path = result[0];
            let score = result[1];
            let data = search_items[path];

            let clone = result_template.content.cloneNode(true);
    
            let title = data.title || data.content.querySelector(data.search_title || "[data-search-title]").innerHTML;
                
            let description = data.description || data.content.querySelector(data.search_description || "[data-search-description]").innerHTML;
            description = description.substring(0, 200) + "...";
    
            clone.querySelector("[data-result-title]").innerHTML = title;
            clone.querySelector("[data-result-title]").parentNode.href = data.href;
            clone.querySelector("[data-result-description]").innerHTML = description;
            clone.querySelector("[data-result-url]").innerHTML = window.location.hostname + data.href;
            clone.querySelector("[data-result-url]").href = data.href;
            clone.querySelector("[data-result-score]").innerHTML = "(" + score + ")";
    
            document.getElementById("search-results").appendChild(clone);
            document.getElementById("results-for-title").innerHTML = `Results for "${url_params.get("q")}"`;
        });
    } catch(error) {
        setTimeout(attempt_load, 100);
        console.error(error);
    }
}

onLoadRegister["Search.js"] = function() {
    setTimeout(() => {
        document.getElementById("search-bar-text-box").value = url_params.get("q");
        document.getElementById("search-bar").classList.add("search-active");
        document.getElementById("search-bar-text-box").classList.remove("search-inactive");
    }, 100);

    document.getElementById("results-for-title").innerHTML = `No results found for "${url_params.get("q")}"`;

    attempt_load();
}