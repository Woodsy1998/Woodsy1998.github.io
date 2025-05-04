// Import the question data from a separate file
import { questionData } from "./questionData.js";  

// Grab relevant elements
const questionnaireOverlay = document.getElementById("questionnaireOverlay");
const closeOverlay = document.getElementById("closeOverlay");
const questionnaireBtn = document.getElementById("questionnaireBtn");
const questionPages = document.querySelectorAll(".question-page");
const nextButtons = document.querySelectorAll(".next-btn");
const prevButtons = document.querySelectorAll(".prev-btn");
const dynamicQuestionWrapper = document.getElementById("dynamicQuestionWrapper");

let currentPage = 0; // Track which "page" user is on

//------------------------------------------------------
// 1. OPEN AND CLOSE OVERLAY
//------------------------------------------------------
questionnaireBtn.addEventListener("click", () => {
  questionnaireOverlay.style.display = "flex";
});

closeOverlay.addEventListener("click", () => {
  questionnaireOverlay.style.display = "none";
  // Reset the form/page if desired
});

//------------------------------------------------------
// 2. MAIN PAGE NAVIGATION (Next / Prev Buttons)
//------------------------------------------------------
nextButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // If user is on Page 1 (index 1 with zero-based indexing),
    // we can check their selected radio and load questions.
    if (currentPage === 1) {
      // Check which solutionType is selected
      const selectedOption = document.querySelector(
        'input[name="solutionType"]:checked'
      );

      if (!selectedOption) {
        alert("Please select a solution type before proceeding.");
        return; // stop if no selection
      }

      // Clear any previously generated pages
      dynamicQuestionWrapper.innerHTML = "";

      // Dynamically create the pages for that selection
      const userChoice = selectedOption.value; // e.g. "consultation", "design", etc.
      generateDynamicPages(userChoice);
    }

    // Then move forward, if not already at the final page
    goToPage(currentPage + 1);
  });
});

prevButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    goToPage(currentPage - 1);
  });
});

//------------------------------------------------------
// 3. FUNCTION TO SHOW/HIDE PAGES
//------------------------------------------------------
function goToPage(pageIndex) {
  // Collect all .question-page (including dynamically created ones)
  const allPages = document.querySelectorAll(".question-page");

  // Boundary checks
  if (pageIndex < 0 || pageIndex >= allPages.length) return;

  // Hide all pages
  allPages.forEach((page) => page.classList.remove("active"));

  // Show only the target page
  allPages[pageIndex].classList.add("active");
  currentPage = pageIndex;
}

//------------------------------------------------------
// 4. GENERATE DYNAMIC QUESTIONS
//------------------------------------------------------
function generateDynamicPages(choice) {
  const questions = questionData[choice]; 
  if (!questions) return; // safety check

  // We'll create 1 page per question OR group them as you like
  // For simplicity, let's do 1 question per page:
  questions.forEach((q, index) => {
    // Create a container div
    const pageDiv = document.createElement("div");
    pageDiv.classList.add("question-page");
    // Use data-page if you want to keep track, or just rely on the order
    pageDiv.setAttribute("data-page", `dynamic-${index}`);

    // Build the content for that question
    // Title
    const h2 = document.createElement("h2");
    h2.textContent = q.title || `Question ${index + 1}`;
    pageDiv.appendChild(h2);

    // Text prompt
    const p = document.createElement("p");
    p.textContent = q.text || "";
    pageDiv.appendChild(p);

    // Input type
    if (q.type === "text") {
      const textarea = document.createElement("textarea");
      textarea.name = `dynamicQ${index}`;
      textarea.rows = 4;
      textarea.placeholder = "Type your answer here...";
      pageDiv.appendChild(textarea);
    }
    // If you wanted radio/checkbox, you'd build them similarly, e.g.:
    // if (q.type === "radio") { ... create radio group ... }

    // "Back" and "Next" buttons can be appended here, or we can rely on a single set of global buttons
    // For clarity, let's add a 'Back' and 'Next' to each dynamic page:
    const btnContainer = document.createElement("div");
    // Add a 'Back' button
    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.classList.add("prev-btn");
    backBtn.textContent = "Back";
    btnContainer.appendChild(backBtn);

    // Add a 'Next' button
    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.classList.add("next-btn");
    nextBtn.textContent = "Next";
    btnContainer.appendChild(nextBtn);

    pageDiv.appendChild(btnContainer);

    // Finally, append this page to the wrapper
    dynamicQuestionWrapper.appendChild(pageDiv);
  });

  // Re-select next/prev buttons on newly generated pages and attach the same event logic
  attachNewButtons();
}

//------------------------------------------------------
// 5. ATTACH NAVIGATION LOGIC TO DYNAMICALLY CREATED BUTTONS
//------------------------------------------------------
function attachNewButtons() {
  // Re-grab all next/prev buttons
  const newNextButtons = document.querySelectorAll(".next-btn");
  const newPrevButtons = document.querySelectorAll(".prev-btn");

  // Remove existing listeners if you want to reattach to avoid doubling.
  // Or attach distinct logic. For simplicity, let's do a quick approach:
  newNextButtons.forEach((btn) => {
    btn.onclick = () => goToPage(currentPage + 1);
  });

  newPrevButtons.forEach((btn) => {
    btn.onclick = () => goToPage(currentPage - 1);
  });
}
