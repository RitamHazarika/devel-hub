const writers = [
  {
    name: "Anika Mehra",
    location: "Mumbai, India",
    focus: "fiction",
    bio: "Writes intimate city stories and swaps weekly notes on character arcs.",
    tags: ["Literary", "Beta reads", "English"],
    initials: "AM",
    color: "var(--coral)",
  },
  {
    name: "Jonas Keller",
    location: "Berlin, Germany",
    focus: "fiction critique",
    bio: "Fantasy writer looking for worldbuilding partners and chapter exchanges.",
    tags: ["Fantasy", "Critique", "German"],
    initials: "JK",
    color: "var(--teal)",
  },
  {
    name: "Marisol Vega",
    location: "Bogota, Colombia",
    focus: "poetry critique",
    bio: "Poet and translator sharing bilingual drafts and performance pieces.",
    tags: ["Poetry", "Spanish", "Translation"],
    initials: "MV",
    color: "var(--gold)",
  },
  {
    name: "Noah Reed",
    location: "Toronto, Canada",
    focus: "fiction",
    bio: "Mystery author building a circle for serial fiction and launch feedback.",
    tags: ["Mystery", "Serials", "Launch"],
    initials: "NR",
    color: "var(--sage)",
  },
  {
    name: "Sofia Lind",
    location: "Stockholm, Sweden",
    focus: "poetry",
    bio: "Writes spare poems about weather, family, and small acts of courage.",
    tags: ["Poetry", "Workshops", "Swedish"],
    initials: "SL",
    color: "var(--teal)",
  },
  {
    name: "Ibrahim Okafor",
    location: "Lagos, Nigeria",
    focus: "fiction critique",
    bio: "Science fiction writer trading feedback on pacing, endings, and dialogue.",
    tags: ["Sci-fi", "Critique", "English"],
    initials: "IO",
    color: "var(--coral)",
  },
];

const textArea = document.querySelector("#storyText");
const titleInput = document.querySelector("#storyTitle");
const genreInput = document.querySelector("#storyGenre");
const scoreValue = document.querySelector("#scoreValue");
const scoreCircle = document.querySelector("#scoreCircle");
const phraseStatus = document.querySelector("#phraseStatus");
const similarityStatus = document.querySelector("#similarityStatus");
const readStatus = document.querySelector("#readStatus");
const sharePreview = document.querySelector("#sharePreview");
const fileInput = document.querySelector("#storyFile");
const fileName = document.querySelector("#fileName");
const writerGrid = document.querySelector("#writerGrid");
const toast = document.querySelector("#toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function calculateOriginality(text) {
  const normalized = text.toLowerCase().replace(/[^\w\s']/g, " ");
  const words = normalized.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const repeatedWords = words.filter((word, index) => words.indexOf(word) !== index && word.length > 4);
  const commonPhrases = [
    "once upon a time",
    "dark and stormy night",
    "at the end of the day",
    "only time will tell",
    "heart skipped a beat",
    "tears rolled down",
  ];
  const phraseHits = commonPhrases.filter((phrase) => normalized.includes(phrase)).length;
  const repetitionPenalty = Math.min(18, repeatedWords.length * 1.5);
  const phrasePenalty = phraseHits * 9;
  const shortDraftPenalty = wordCount < 35 ? 8 : 0;
  return Math.max(58, Math.round(96 - repetitionPenalty - phrasePenalty - shortDraftPenalty));
}

function updateOriginality() {
  const score = calculateOriginality(textArea.value);
  const circumference = 327;
  scoreValue.textContent = `${score}%`;
  scoreCircle.style.strokeDashoffset = `${circumference - (score / 100) * circumference}`;
  scoreCircle.style.stroke = score >= 85 ? "var(--sage)" : score >= 72 ? "var(--gold)" : "var(--coral)";

  phraseStatus.textContent = score >= 85 ? "Fresh phrasing" : score >= 72 ? "Some familiar phrasing" : "Rewrite suggested";
  similarityStatus.textContent = score >= 85 ? "Low similarity" : score >= 72 ? "A few similar phrases" : "High phrase overlap";
  readStatus.textContent = titleInput.value.trim() && textArea.value.trim().length > 80 ? "Ready for readers" : "Draft needs detail";
  sharePreview.textContent = `${titleInput.value || "Untitled story"} - a ${genreInput.value} story on Writer's Block.`;
}

function renderWriters(filter = "all") {
  writerGrid.innerHTML = "";
  writers
    .filter((writer) => filter === "all" || writer.focus.includes(filter))
    .forEach((writer) => {
      const card = document.createElement("article");
      card.className = "writer-card";
      card.innerHTML = `
        <div class="writer-top">
          <span class="avatar" style="background:${writer.color}">${writer.initials}</span>
          <div>
            <h3>${writer.name}</h3>
            <p>${writer.location}</p>
          </div>
        </div>
        <p>${writer.bio}</p>
        <div class="tags">${writer.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        <button class="connect-button" type="button">Connect</button>
      `;
      card.querySelector(".connect-button").addEventListener("click", () => {
        showToast(`Connection request sent to ${writer.name}.`);
      });
      writerGrid.appendChild(card);
    });
}

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderWriters(button.dataset.filter);
  });
});

document.querySelectorAll(".social-button").forEach((button) => {
  button.addEventListener("click", async () => {
    const text = sharePreview.textContent;
    if (button.dataset.network === "Copy") {
      await navigator.clipboard.writeText(text);
      showToast("Share text copied.");
      return;
    }
    showToast(`Prepared ${button.dataset.network} post: ${text}`);
  });
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;
  fileName.textContent = file.name;
  if (file.type === "text/plain" || file.name.endsWith(".md")) {
    const reader = new FileReader();
    reader.onload = () => {
      textArea.value = reader.result;
      updateOriginality();
      showToast("Story text loaded and checked.");
    };
    reader.readAsText(file);
  } else {
    showToast("File attached. Text preview is available for TXT and Markdown files.");
  }
});

[textArea, titleInput, genreInput].forEach((field) => {
  field.addEventListener("input", updateOriginality);
});

renderWriters();
updateOriginality();
