const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("findit-theme");
const initialTheme = savedTheme === "dark" ? "dark" : "light";

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
  themeToggle.setAttribute("aria-pressed", String(isDark));
}

setTheme(initialTheme);
themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  localStorage.setItem("findit-theme", nextTheme);
});

// Sample listings for the UI preview. Replace these with data from your Flask backend.
const items = [
  { title: "Wireless earbuds case", category: "electronics", location: "USM Library", emoji: "🎧", color: "lilac" },
  { title: "Student ID card", category: "ids", location: "College of Engineering", emoji: "🪪", color: "blue" },
  { title: "Stainless water bottle", category: "other", location: "University Cafeteria", emoji: "🥤", color: "orange" },
  { title: "Set of keys", category: "accessories", location: "USM Main Gate", emoji: "🔑", color: "yellow" },
  { title: "Blue umbrella", category: "accessories", location: "Student Center", emoji: "☂️", color: "blue" },
  { title: "Notebook", category: "other", location: "College of Education", emoji: "📓", color: "pink" }
];

const categoryNames = {
  electronics: "Electronics",
  ids: "IDs & cards",
  accessories: "Accessories",
  other: "Other"
};

const grid = document.getElementById("item-grid");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search-input");
let activeCategory = "all";

function renderItems() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = items.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const searchableText = `${item.title} ${item.location} ${item.description || ""}`.toLowerCase();
    return matchesCategory && searchableText.includes(query);
  });

  grid.innerHTML = filtered.map((item) => `
    <article class="card">
      <div class="card-art ${item.color}">
        <span class="type-badge">Found item</span>
        <span class="item-emoji" aria-hidden="true">${item.emoji}</span>
      </div>
      <div class="card-body">
        <div class="card-title-row">
          <h3>${escapeHtml(item.title)}</h3>
          <span class="category-label">${categoryNames[item.category]}</span>
        </div>
        ${item.description ? `<p class="location">${escapeHtml(item.description)}</p>` : ""}
        <p class="location"><span>●</span>${escapeHtml(item.location)}</p>
      </div>
    </article>
  `).join("");

  emptyState.style.display = filtered.length ? "none" : "block";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".filter.active")?.classList.remove("active");
    button.classList.add("active");
    activeCategory = button.dataset.category;
    renderItems();
  });
});

searchInput.addEventListener("input", renderItems);
document.getElementById("search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  renderItems();
});

const modal = document.getElementById("report-modal");
const reportForm = document.getElementById("report-form");

document.getElementById("open-report").addEventListener("click", () => modal.classList.add("open"));
document.getElementById("close-report").addEventListener("click", () => modal.classList.remove("open"));

modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.classList.remove("open");
});

reportForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(reportForm);
  const title = formData.get("title").trim();
  const location = formData.get("location").trim();

  if (!title || !location) return;

  const category = formData.get("category");
  const colorByCategory = {
    electronics: "lilac",
    ids: "blue",
    accessories: "yellow",
    other: "orange"
  };
  const emojiByCategory = {
    electronics: "📱",
    ids: "🪪",
    accessories: "🎒",
    other: "📦"
  };

  items.unshift({
    title,
    category,
    location,
    description: formData.get("description").trim(),
    color: colorByCategory[category],
    emoji: emojiByCategory[category]
  });

  reportForm.reset();
  modal.classList.remove("open");
  activeCategory = "all";
  document.querySelector(".filter.active")?.classList.remove("active");
  document.querySelector('[data-category="all"]').classList.add("active");
  searchInput.value = "";
  renderItems();

  const toast = document.getElementById("toast");
  toast.textContent = "Demo listing added to this page.";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
});

renderItems();
