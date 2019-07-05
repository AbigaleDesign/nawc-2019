"use strict";

// ---------- default SPA Web App setup ---------- //

// hide all pages
function hideAllPages() {
  let pages = document.querySelectorAll(".page");
  for (let page of pages) {
    page.style.display = "none";
  }
}

// show page or tab
function showPage(pageId) {
  hideAllPages();
  document.querySelector(`#${pageId}`).style.display = "block";
  setActiveTab(pageId);

  // close burger menu when page change
  if (window.matchMedia("(max-width: 700px)").matches) {
      document.querySelector('#menu-items').style.display = "none";
  }
}

// set default page
function setDefaultPage(defaultPageName) {
  if (location.hash) {
    defaultPageName = location.hash.slice(1);
  }
  showPage(defaultPageName);
}

// sets active tabbar/ menu item
function setActiveTab(pageId) {
  let pages = document.querySelectorAll(".tabbar a");
  for (let page of pages) {
    if (`#${pageId}` === page.getAttribute("href")) {
      page.classList.add("active");
    } else {
      page.classList.remove("active");
    }
  }
}

function showLoader(show) {
  let loader = document.querySelector('#loader');
  if (show) {
    loader.classList.remove("hide");
  } else {
    loader.classList.add("hide");
  }
}

// ---------- Fetch data from data sources ---------- //
/*
Fetches pages json data from my headless cms
*/
fetch("http://abigaledesign.dk/wordpress/wp-json/wp/v2/pages?_embed")
  .then(function(response) {
    return response.json();
  })
  .then(function(pages) {
    appendPages(pages);
  });


/*
Appends and generate pages
*/
function appendPages(pages) {
  var menuTemplate = "";
  for (let page of pages) {
    addMenuItem(page);
    addPage(page);
  }
  setDefaultPage(pages[0].slug); // selecting the first page in the array of
  getBoeger();
  getKrystaller();
  getMaetter();
  setTimeout(function() {
    showLoader(false);
  }, 500);
}

// appends menu item to the nav menu
function addMenuItem(page) {
  document.querySelector("#menu-items").innerHTML += `
  <a href="#${page.slug}" onclick="showPage('${page.slug}')">${page.title.rendered}</a>
  `;

}

// appends page section to the DOM
function addPage(page) {
  document.querySelector("#pages").innerHTML += `
  <section id="${page.slug}" class="page">
    ${page.content.rendered}
  </section>
  `;
}

/*
Fetches post data from my headless cms
*/
function getBoeger() {
  fetch('http://abigaledesign.dk/wordpress/wp-json/wp/v2/posts?_embed&categories=1')
    .then(function(response) {
      return response.json();
    })
    .then(function(boeger) {
      appendBoeger(boeger);
    });
}

/*
Appends json data to the DOM
*/
function appendBoeger(boeger, slug) {
  let htmlTemplate = '<section class="grid-container">';
  for (let bog of boeger) {
    console.log();
    htmlTemplate += `
      <article>
        <img src="${getFeaturedImageUrl(bog)}">
        <h2>${bog.title.rendered}</h2>
        <p>DKK ${bog.acf.pris}</p>
    </article>
    `;
  }
  htmlTemplate += '</section>';
  document.querySelector("#boeger").innerHTML += htmlTemplate;
}

/*
Fetches post data from my headless cms
*/
function getMaetter() {
  fetch('http://abigaledesign.dk/wordpress/wp-json/wp/v2/posts?_embed&categories=5')
    .then(function(response) {
      return response.json();
    })
    .then(function(maetter) {
      appendMaetter(maetter);
    });
}

/*
Appends json data to the DOM
*/
function appendMaetter(maetter, slug) {
  let htmlTemplate = '<section class="grid-container">';
  for (let maette of maetter) {
    console.log();
    htmlTemplate += `
      <article>
        <img src="${getFeaturedImageUrl(maette)}">
        <h2>${maette.title.rendered}</h2>
      </article>
    `;
  }
  htmlTemplate += '</section>';
  document.querySelector("#yoga-udstyr").innerHTML += htmlTemplate;
}


/*
Fetches post data from my headless cms
*/
function getKrystaller() {
  fetch("http://abigaledesign.dk/wordpress/wp-json/wp/v2/posts?_embed&categories=2")
    .then(function(response) {
      return response.json();
    })
    .then(function(krystaller) {
      appendKrystaller(krystaller);
    });
}

// appends teachers
function appendKrystaller(krystaller, slug) {
  let htmlTemplate = '<section class="grid-container">';
  for (let krystal of krystaller) {
    htmlTemplate += `
    <article>
      <img src="${getFeaturedImageUrl(krystal)}">
        <h2>${krystal.title.rendered}</h2>
    </article>
     `;
  }
  htmlTemplate += '</section>';
  document.querySelector("#krystaller").innerHTML += htmlTemplate;
}


// returns the source url of the featured image of given post or page
function getFeaturedImageUrl(post) {
  let imageUrl = "";
  if (post._embedded['wp:featuredmedia']) {
    imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
  }
  return imageUrl;
}

/* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */
function showHideBurgerMenu() {
  let menuItems = document.querySelector('#menu-items');
  if (menuItems.style.display === "block") {
    menuItems.style.display = "none";
  } else {
    menuItems.style.display = "block";
  }
}