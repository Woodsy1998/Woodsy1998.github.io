/****************************************
 * script.js (Disable all scrolling mid-animation)
 ****************************************/
document.addEventListener('DOMContentLoaded', () => {
    /*************************
     * SELECTORS / VARIABLES
     *************************/
    const sections = document.querySelectorAll('.page-section');
    let currentIndex = 0;
    let isScrolling = false;
  
    const menuOverlay = document.getElementById('menuOverlay');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
  
    /*************************
     * EVENT: MOUSE WHEEL
     *************************/
    window.addEventListener('wheel', (e) => {
      // If overlay is open or mid-animation, block
      if (menuOverlay.classList.contains('active') || isScrolling) {
        e.preventDefault();
        return;
      }
      // Otherwise check direction
      if (e.deltaY > 0) {
        // Scroll down
        if (currentIndex < sections.length - 1) {
          scrollToSection(currentIndex, currentIndex + 1);
        }
      } else {
        // Scroll up
        if (currentIndex > 0) {
          scrollToSection(currentIndex, currentIndex - 1);
        }
      }
    }, { passive: false });
  
    /*************************
     * EVENT: KEYBOARD
     *************************/
    window.addEventListener('keydown', (e) => {
      // If overlay is open or mid-scroll, ignore
      if (menuOverlay.classList.contains('active') || isScrolling) {
        e.preventDefault();
        return;
      }
      const key = e.keyCode;
      // Down keys => space(32), pageDown(34), arrowDown(40)
      if (key === 32 || key === 34 || key === 40) {
        e.preventDefault();
        if (currentIndex < sections.length - 1) {
          scrollToSection(currentIndex, currentIndex + 1);
        }
      }
      // Up keys => pageUp(33), arrowUp(38)
      else if (key === 33 || key === 38) {
        e.preventDefault();
        if (currentIndex > 0) {
          scrollToSection(currentIndex, currentIndex - 1);
        }
      }
    }, { passive: false });
  
  
    /*************************
     * SCROLL LOGIC
     *************************/
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }
  
    function scrollToY(targetY, duration = 800, callback) {
      const startY = window.scrollY;
      const distance = targetY - startY;
      let startTime = null;
  
      function animateScroll(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
  
        const easedProgress = easeOutCubic(progress);
        const currentY = startY + distance * easedProgress;
        window.scrollTo(0, currentY);
  
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else if (typeof callback === 'function') {
          callback();
        }
      }
      requestAnimationFrame(animateScroll);
    }
  
    /**
     * scrollToSection:
     * 1) Mark isScrolling
     * 2) disableScroll() -> no partial scrolling
     * 3) do animations
     * 4) once done, if overlay not active -> enableScroll()
     */
    function scrollToSection(fromIndex, toIndex) {
      isScrolling = true;
      disableScroll();  // <--- BLOCK SCROLLING DURING ANIMATION
  
      const oldSection = sections[fromIndex];
      const newSection = sections[toIndex];
      const targetY = newSection.offsetTop;
  
      // Start custom scroll
      scrollToY(targetY, 900, () => {
        // After scroll finishes, zoom in new section
        newSection.classList.add('zoom-in');
  
        // Wait for zoomIn
        setTimeout(() => {
          oldSection.classList.remove('zoom-out');
          newSection.classList.remove('zoom-out', 'zoom-in');
          currentIndex = toIndex;
          isScrolling = false;
  
          // Re-enable scroll ONLY if overlay is not active
          if (!menuOverlay.classList.contains('active')) {
            enableScroll();
          }
        }, 300);
      });
  
      // Zoom out both sections
      oldSection.classList.add('zoom-out');
      newSection.classList.add('zoom-out');
    }
  
    /*************************
     * TYPED TEXT
     *************************/
    const typedTarget = document.getElementById('typedTarget');
    if (typedTarget) {
      const words = ["Carbonem", "AV Professionals", "Q-Sys Programmers", "LX Programmers", "Audio Designers","System Integrators" ,"UI Designers"];
      let currentWordIndex = 0;
  
      const typingSpeed = 60;
      const backspaceSpeed = 30;
      const pauseAfterWord = 1000;
      const pauseBetweenWords = 300;
  
      function typeWord(word, callback) {
        let charIndex = 0;
        function typeChar() {
          if (charIndex < word.length) {
            typedTarget.textContent += word[charIndex];
            charIndex++;
            setTimeout(typeChar, typingSpeed);
          } else if (callback) {
            callback();
          }
        }
        typeChar();
      }
      function backspaceWord(callback) {
        const currentText = typedTarget.textContent;
        let length = currentText.length;
        function removeChar() {
          if (length > 0) {
            typedTarget.textContent = currentText.slice(0, length - 1);
            length--;
            setTimeout(removeChar, backspaceSpeed);
          } else if (callback) {
            callback();
          }
        }
        removeChar();
      }
      function startRotatingWords() {
        const currentWord = words[currentWordIndex];
        typeWord(currentWord, () => {
          setTimeout(() => {
            backspaceWord(() => {
              currentWordIndex = (currentWordIndex + 1) % words.length;
              setTimeout(startRotatingWords, pauseBetweenWords);
            });
          }, pauseAfterWord);
        });
      }
      startRotatingWords();
    }
  
/*************************
 * TYPED TEXT PORTFOLIO (FINAL FIX)
 *************************/
const typedTargetPortfolio = document.getElementById('typedTargetPortfolio');

if (typedTargetPortfolio) {
    const words = [
        "Cloudland",
        "The Doonan",
        "Beaumont Hotel",
        "Wonderland",
        "Newstead Social",
        "The Met",
        "Crowbar Brisbane",
        "Hamilton Social"
    ];
    let currentWordIndex = 0;

    const typingSpeed = 60;
    const backspaceSpeed = 30;
    const pauseAfterWord = 1000;
    const pauseBetweenWords = 300;

    function typeWord(word, callback) {
        let charIndex = 0;
        function typeChar() {
            if (charIndex < word.length) {
                // Ensure no placeholder is present while typing
                if (typedTargetPortfolio.innerHTML === "&nbsp;") {
                    typedTargetPortfolio.innerHTML = "";
                }
                typedTargetPortfolio.textContent += word[charIndex];
                charIndex++;
                setTimeout(typeChar, typingSpeed);
            } else if (callback) {
                callback();
            }
        }
        typeChar();
    }

    function backspaceWord(callback) {
        function removeChar() {
            let length = typedTargetPortfolio.textContent.length;
            if (length > 1) {
                typedTargetPortfolio.textContent = typedTargetPortfolio.textContent.slice(0, length - 1);
                setTimeout(removeChar, backspaceSpeed);
            } else {
                // Only apply the placeholder AFTER last character is removed
                typedTargetPortfolio.textContent = "";
                typedTargetPortfolio.innerHTML = "&nbsp;";
                if (callback) callback();
            }
        }
        removeChar();
    }

    function startRotatingWords() {
        const currentWord = words[currentWordIndex];
        typeWord(currentWord, () => {
            setTimeout(() => {
                backspaceWord(() => {
                    currentWordIndex = (currentWordIndex + 1) % words.length;
                    setTimeout(startRotatingWords, pauseBetweenWords);
                });
            }, pauseAfterWord);
        });
    }

    startRotatingWords();
}



    
    /*************************
     * CONTACT FORM
     *************************/
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const phoneField = document.getElementById('phone');
        const messageField = document.getElementById('message');
  
        removeExistingStatusMessages(contactForm);
  
        let isValid = true;
        if (!nameField.value.trim()) {
          showError(contactForm, 'Name is required.');
          isValid = false;
        }
        if (!emailField.value.trim() || !isValidEmail(emailField.value.trim())) {
          showError(contactForm, 'A valid Email is required.');
          isValid = false;
        }
        if (!messageField.value.trim()) {
          showError(contactForm, 'Message is required.');
          isValid = false;
        }
        if (!isValid) return;
  
        const formData = {
          name: nameField.value.trim(),
          email: emailField.value.trim(),
          phone: phoneField.value.trim(),
          message: messageField.value.trim()
        };
  
        fetch('/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.success) {
            showSuccess(contactForm, data.message || 'Thank you for contacting us!');
            contactForm.reset();
          } else {
            showError(contactForm, data.message || 'Something went wrong. Please try again later.');
          }
        })
        .catch((error) => {
          showError(contactForm, `Error: ${error.message}`);
        });
      });
    }
  
    /*************************
     * DISABLE/ENABLE SCROLL
     *************************/
    function disableScroll() {
      document.body.style.overflow = 'hidden';
      document.addEventListener('wheel', preventScroll, { passive: false, capture: true });
      document.addEventListener('touchmove', preventScroll, { passive: false, capture: true });
      document.addEventListener('keydown', preventKeyScroll, { capture: true });
    }
    function enableScroll() {
      document.body.style.overflow = '';
      document.removeEventListener('wheel', preventScroll, { passive: false, capture: true });
      document.removeEventListener('touchmove', preventScroll, { passive: false, capture: true });
      document.removeEventListener('keydown', preventKeyScroll, { capture: true });
    }
    function preventScroll(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    function preventKeyScroll(e) {
      const keys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
      if (keys.includes(e.keyCode)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  
    /*************************
     * HAMBURGER
     *************************/
    if (hamburgerBtn && menuOverlay) {
      hamburgerBtn.addEventListener('click', () => {
        menuOverlay.classList.toggle('active');
        if (menuOverlay.classList.contains('active')) {
            document.body.classList.add('menu-open');
          } else {
            document.body.classList.remove('menu-open');
          }
        if (menuOverlay.classList.contains('active')) {
          disableScroll();
        } else {
          enableScroll();
        }
      });
    }
  
    /*************************
     * SMOOTH SCROLL FOR LINKS
     *************************/
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', (ev) => {
        // If overlay is open, close & enable scroll
        if (menuOverlay.classList.contains('active')) {
          menuOverlay.classList.remove('active');
          enableScroll();
        }
        // If mid-animation, ignore
        if (isScrolling) {
          ev.preventDefault();
          return;
        }
        const hash = link.getAttribute('href');
        if (hash && hash !== '#') {
          const targetEl = document.querySelector(hash);
          if (targetEl) {
            ev.preventDefault();
            // If targetEl is a .page-section
            const index = Array.from(sections).indexOf(targetEl);
            if (index !== -1 && index !== currentIndex) {
              scrollToSection(currentIndex, index);
            } else {
              scrollToY(targetEl.offsetTop, 900);
            }
          }
        }
      });
    });
  });
  
  /****************************************
   * HELPER UTILS
   ****************************************/
  function isValidEmail(email) {
    const pattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return pattern.test(email);
  }
  function removeExistingStatusMessages(form) {
    const existingStatus = form.querySelectorAll('.error, .success');
    existingStatus.forEach(msg => msg.remove());
  }
  function showError(form, message) {
    const errorP = document.createElement('p');
    errorP.classList.add('error');
    errorP.textContent = message;
    form.appendChild(errorP);
  }
  function showSuccess(form, message) {
    const successP = document.createElement('p');
    successP.classList.add('success');
    successP.textContent = message;
    form.appendChild(successP);
  }
  
/*************************
 * SERVICE HOVER -> TYPE
 *************************/
// Adjust these variables as needed
let typingSpeed = 0.3;     // Milliseconds between typed characters
let deletingSpeed = 0;   // (Optional) Milliseconds between deleted characters

const serviceItems = document.querySelectorAll('.service-item');
const servicesTextContainer = document.getElementById('servicesTextContainer');
const servicesTyped = document.getElementById('servicesTyped');
const servicesCursor = document.getElementById('servicesCursor');

let typingTimeout = null;
let deletingTimeout = null;
let currentServiceText = "";
let isTyping = false;

// For the "cursor follows" approach, we measure each character after it’s appended
// and re-position the #servicesCursor.
function placeCursorAtEnd() {
  const textSpan = servicesTyped;
  const rect = textSpan.getBoundingClientRect();
  servicesCursor.style.left = (rect.width + 10) + "px";
  servicesCursor.style.top = 0 + "px"; 
  // If multiline, more advanced logic to find line breaks is needed
}

function typeCharacter(text, idx, callback) {
  if (idx < text.length) {
    servicesTyped.textContent += text.charAt(idx);
    placeCursorAtEnd();
    typingTimeout = setTimeout(
      () => typeCharacter(text, idx + 1, callback),
      typingSpeed
    );
  } else {
    isTyping = false;
    if (callback) callback();
  }
}

function typeServiceText(newText) {
  clearTimeout(typingTimeout);
  clearTimeout(deletingTimeout);
  
  // Preload text invisibly to force word wrapping
  servicesTyped.innerHTML = `<span style="visibility:hidden; white-space: normal;">${newText}</span>`;

  // Wait for browser to render layout before typing starts
  setTimeout(() => {
    servicesTyped.textContent = ""; // Clear invisible text
    isTyping = true;
    typeCharacter(newText, 0);
  }, 10);
}

/* function typeServiceText(newText) {
  // If we’re still typing or deleting, stop
  clearTimeout(typingTimeout);
  clearTimeout(deletingTimeout);
  
  // Immediately clear the existing text before typing
  servicesTyped.textContent = ""; 
  isTyping = true;
  
  // Start typing the new text
  typeCharacter(newText, 0, () => {
    // Done typing
  });
} */

serviceItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    // We fill it in with .active and remove from others
    serviceItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    const newText = item.getAttribute('data-service-body');
    if (newText !== currentServiceText) {
      currentServiceText = newText;
      typeServiceText(newText);
    }
  });
});

// Select all headings
const serviceHeadings = document.querySelectorAll('.services-left h3');
serviceHeadings.forEach(heading => {
  heading.addEventListener('mouseenter', () => {
    // remove .active from all h3
    serviceHeadings.forEach(h => h.classList.remove('active'));
    // add .active to the hovered one
    heading.classList.add('active');
  });
});

// document.querySelector('video').playbackRate = 1;

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded"); // Debugging log

  const portfolioWrapper = document.getElementById("portfolioWrapper");
  const scrollLeft = document.getElementById("scrollLeft");
  const scrollRight = document.getElementById("scrollRight");

  if (!portfolioWrapper || !scrollLeft || !scrollRight) {
      console.error("Error: Portfolio elements not found in DOM.");
      return;
  }

  console.log("Portfolio elements found, initializing..."); // Debugging log

  const portfolioItems = [
      { image: "images/cloudland-placeholder.webp", title: "Cloudland", desc: "Q-SYS ecosystem upgrade.", link: "cloudland.html" },
      { image: "images/the-beaumont-rooftop.jpg", title: "Beaumont Hotel", desc: "Multi-level AV control systems.", link: "beaumont-hotel.html" },
      { image: "images/cloudland-placeholder.webp", title: "The Met", desc: "Smart home automation.", link: "the-met.html" },
      { image: "images/cloudland-placeholder.webp", title: "Tiny Mountain Brewery", desc: "Outdoor sound systems.", link: "outdoor-sound.html" },
      { image: "images/cloudland-placeholder.webp", title: "Crowbar Brisbane", desc: "Advanced Q-SYS solutions.", link: "qsys-programming.html" },
      { image: "images/cloudland-placeholder.webp", title: "The Doonan", desc: "Custom AV integration.", link: "the-doonan.html" },
      { image: "images/cloudland-placeholder.webp", title: "Hamilton Social", desc: "AV for modern social spaces.", link: "hamilton-social.html" },
      { image: "images/cloudland-placeholder.webp", title: "Wonderland", desc: "Immersive venue solutions.", link: "wonderland.html" },
      { image: "images/cloudland-placeholder.webp", title: "The Island", desc: "Luxury AV installations.", link: "the-island.html" },
      { image: "images/cloudland-placeholder.webp", title: "Empire Hotel / Press Club", desc: "Live performance audio.", link: "empire-hotel.html" },
      { image: "images/cloudland-placeholder.webp", title: "Newstead Social", desc: "Bar & venue automation.", link: "newstead-social.html" },
      { image: "images/cloudland-placeholder.webp", title: "Bunker", desc: "Underground club sound.", link: "bunker.html" }
  ];

  let currentIndex = 0;
  const itemsPerPage = 6;

  function renderPortfolioItems() {
      console.log("Rendering portfolio items, current index:", currentIndex); // Debugging log

      portfolioWrapper.innerHTML = ""; // Clear previous items
      for (let i = currentIndex; i < currentIndex + itemsPerPage; i++) {
          if (i >= portfolioItems.length) break;
          const item = portfolioItems[i];
          const portfolioItem = document.createElement("div");
          portfolioItem.classList.add("portfolio-item");

          portfolioItem.innerHTML = `
              <img src="${item.image}" alt="${item.title}">
              <div class="portfolio-content">
                  <h2>${item.title}</h2>
                  <p>${item.desc}</p>
                  <a href="${item.link}" class="btn">Learn More</a>
              </div>
          `;

          portfolioWrapper.appendChild(portfolioItem);
      }
  }

  scrollLeft.addEventListener("click", () => {
      if (currentIndex > 0) {
          currentIndex -= itemsPerPage;
          renderPortfolioItems();
      }
  });

  scrollRight.addEventListener("click", () => {
      if (currentIndex + itemsPerPage < portfolioItems.length) {
          currentIndex += itemsPerPage;
          renderPortfolioItems();
      }
  });

  // Ensure portfolio items render on initial load
  renderPortfolioItems();
});

document.addEventListener("DOMContentLoaded", function() {
  const sections = document.querySelectorAll(".page-section");
  const lastSection = sections[sections.length - 1];

  if (lastSection) {
    lastSection.insertAdjacentElement("afterend", document.querySelector("footer"));
  }
});