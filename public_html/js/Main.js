/* By Zachary A. Miller */

const phrases = [
    "Enjoy the festival and let your imagination blossom!", 
    "Spring to life with flowers and blossom!", 
    "Let the blossoms put a spring in your step!", 
    "Pause the spring cleaning and enjoy the Cherry Blossom Festival!"
];

var onLoadRegister = {};

let menu_visible = false;
let menu_db = false

function toggleMenu() {
	let menu_button = document.getElementById("nav-menu")
	let menu = document.getElementById("menu-dropdown");
	let navbar = document.getElementById("nav-bar");

	if(menu_db == false) {
		menu_visible = !menu_visible;

		if(menu_visible == true) {
			menu.parentNode.classList.add("menu-visible");
			menu_button.classList.add("menu-button-active");
			
			menu_db = true;
			setTimeout(() => {
				menu.classList.add("menu-visible");
				navbar.classList.remove("retracted-nav");
				menu_db = false;
			}, 0);
		} else {			
			menu.classList.remove("menu-visible");
			menu_button.classList.remove("menu-button-active");			
			navbar.classList.add("sticky-nav");

			if(window.pageYOffset >= navbar.offsetTop + 1) {
				navbar.classList.add("retracted-nav");
			}

			menu_db = true;
			setTimeout(() => {
				menu.parentNode.classList.remove("menu-visible");
				menu_db = false;
			}, 300);
		}
	}
}

document.addEventListener("click", (e) => {
	const menu = document.getElementById("menu-dropdown");
	let navbar = document.getElementById("nav-bar");
	let target = e.target;

	do {
	  	if(target == menu || target == navbar) return;

	 	target = target.parentNode;
	} while (target);
	    
	menu.classList.remove("menu-visible");

	if(window.pageYOffset >= navbar.offsetTop + 1) {
		navbar.classList.add("sticky-nav");
			
		if(!menu.classList.contains("menu-visible")) {
			navbar.classList.add("retracted-nav");
		}
	}

	menu_db = true;

	setTimeout(() => {
		menu.parentNode.classList.remove("menu-visible");
		menu_visible = false;
		menu_db = false;
	}, 300);
});

var searchButtonDB = false;

function onSearchClick() {
    let searchbar = document.getElementById("search-bar");
    let textbox = document.getElementById("search-bar-text-box");

    if(searchbar && searchButtonDB == false) {
        searchbar.classList.toggle("search-active");
        textbox.classList.toggle("search-inactive");

        if(searchbar.classList.contains("search-active")) {
            document.getElementById("search-bar-text-box").setAttribute('placeholder', 'Search...');
            searchButtonDB = true;

            setTimeout(() => {
                document.getElementById("search-bar-text-box").focus();
                searchButtonDB = false;
            }, 350);
        } else {
            document.getElementById("search-bar-text-box").setAttribute('placeholder', '');
            document.getElementById("search-bar-text-box").blur();
            searchButtonDB = true;

            setTimeout(() => {
                searchButtonDB = false;
            }, 350);
        }
    }
}

function onEnterClick() {
    let textbox = document.getElementById("search-bar-text-box");
    
    if(textbox && textbox.value.replace(/[^a-zA-Z0-9 ]/g, "") != "") {
        location.href = `/Search/?q=${textbox.value}`;
    }
}

function set_phrase() {
	try {
		document.getElementById("blossom-phrase").innerHTML = phrases[Math.floor(Math.random() * phrases.length)];
	} catch(e) {
		setTimeout(set_phrase, 100);
	}
}

document.addEventListener("keyup", function(event) {
    if(event.key === "Enter" && $("#search-bar-text-box").is(":focus")) {
        onEnterClick();
    }
});

window.onscroll = function() {
	let navbar = document.getElementById("nav-bar");
	let menu = document.getElementById("menu-dropdown");
	
	if(navbar) {
		if (window.pageYOffset >= navbar.offsetTop + 1) {
			navbar.classList.add("sticky-nav");
			
			if(!menu.classList.contains("menu-visible")) {
				navbar.classList.add("retracted-nav");
			}
		} else {
			navbar.classList.remove("sticky-nav");
			navbar.classList.remove("retracted-nav");
		}
	}
}

window.onload = function() {
    let elements = document.getElementsByTagName('*'), i;

	for(i in elements) {
        let element = elements[i];

        if(element.hasAttribute && element.hasAttribute('data-include')) {
            fragment(element, element.getAttribute('data-include'));
		} else if(element.hasAttribute && element.hasAttribute('data-replace')) {
			$.ajax({
                url: element.getAttribute('data-replace').split(' ')[0],
                type: 'GET',
                success: data => {
                    let content = document.createElement("div");
                    content.innerHTML = data.substring(data.indexOf("<body>") + 6);
        
					let innerHTML = content.querySelector(element.getAttribute('data-replace').split(' ')[1]).innerHTML;
					element.innerHTML = innerHTML;
                }
            });
		}
	}

	function fragment(el, url) {
		let localTest = /^(?:file):/,
			xmlhttp = new XMLHttpRequest(),
			status = 0;

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				status = xmlhttp.status;
			}

			if (localTest.test(location.href) && xmlhttp.responseText) {
				status = 200;
			}

			if (xmlhttp.readyState == 4 && status == 200) {
				el.outerHTML = xmlhttp.responseText;
			}
		}

		try { 
			xmlhttp.open("GET", url, true);
			xmlhttp.send();
		} catch(err) {}
	}

    for(const [key, func] of Object.entries(onLoadRegister)) {
        func();
    }

	setTimeout(() => {
		set_phrase();

		if(document.getElementById("search")) {
			let nav_search = document.getElementById("nav-search");
	
			nav_search.parentNode.removeChild(nav_search);
		}
	}, 100);
}