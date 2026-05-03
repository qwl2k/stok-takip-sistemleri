const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

function login() {
  const username = $("#username").value.trim();
  const password = $("#password").value.trim();

  if (username === "admin" && password === "1234") {
    $("#loginScreen").classList.add("hidden");
    $("#app").classList.remove("hidden");
    renderAll();
  } else {
    alert("Kullanıcı adı veya şifre hatalı.");
  }
}

function logout() {
  $("#app").classList.add("hidden");
  $("#loginScreen").classList.remove("hidden");
}

function setPage(page) {
  $$(".page").forEach(p => p.classList.add("hidden"));
  $(`#${page}Page`).classList.remove("hidden");

  $$(".nav-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`[data-page="${page}"]`).classList.add("active");

  const titles = {
    dashboard: "Ana Panel",
    inventory: "Stoklar",
    projects: "Projeler"
  };

  $("#pageTitle").textContent = titles[page];
}

function renderDashboard() {
  const stats = Inventory.stats();
  $("#totalItems").textContent = stats.total;
  $("#lowStock").textContent = stats.low;
  $("#totalProjects").textContent = Projects.all().length;

  $("#recentItems").innerHTML = stats.recent.length
    ? stats.recent.map(i => `<p><b>${i.name}</b> — ${i.quantity} adet</p>`).join("")
    : "<p>Henüz malzeme yok.</p>";
}

function renderInventory() {
  const query = $("#searchInput").value.toLowerCase();
  const items = Inventory.all().filter(item =>
    item.name.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query) ||
    item.code.toLowerCase().includes(query)
  );

  $("#inventoryTable").innerHTML = items.map(item => {
    const low = item.quantity <= item.min;
    return `
      <tr>
        <td>${item.code}</td>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${item.quantity}</td>
        <td><span class="badge ${low ? "low" : "ok"}">${low ? "Kritik" : "Yeterli"}</span></td>
        <td><button class="delete-btn" onclick="deleteItem('${item.id}')">Sil</button></td>
      </tr>
    `;
  }).join("");
}

function renderProjects() {
  const projects = Projects.all();

  $("#projectList").innerHTML = projects.length
    ? projects.map(project => `
      <div class="project-card">
        <h4>${project.name}</h4>
        <p>Sorumlu: ${project.owner}</p>
        <small>Oluşturma: ${project.createdAt}</small>
      </div>
    `).join("")
    : "<p>Henüz proje yok.</p>";
}

function renderAll() {
  renderDashboard();
  renderInventory();
  renderProjects();
}

function addItem() {
  const name = $("#itemName").value;
  const category = $("#itemCategory").value;
  const quantity = $("#itemQuantity").value;
  const min = $("#itemMin").value;

  if (!name || !category || quantity === "" || min === "") {
    alert("Tüm malzeme alanlarını doldur.");
    return;
  }

  Inventory.add(name, category, quantity, min);

  $("#itemName").value = "";
  $("#itemCategory").value = "";
  $("#itemQuantity").value = "";
  $("#itemMin").value = "";

  renderAll();
}

function deleteItem(id) {
  if (confirm("Bu malzemeyi silmek istiyor musun?")) {
    Inventory.remove(id);
    renderAll();
  }
}

function addProject() {
  const name = $("#projectName").value;
  const owner = $("#projectOwner").value;

  if (!name || !owner) {
    alert("Proje adı ve sorumlu kişi gerekli.");
    return;
  }

  Projects.add(name, owner);
  $("#projectName").value = "";
  $("#projectOwner").value = "";
  renderAll();
}

document.addEventListener("DOMContentLoaded", () => {
  $("#loginBtn").addEventListener("click", login);
  $("#logoutBtn").addEventListener("click", logout);
  $("#addItemBtn").addEventListener("click", addItem);
  $("#addProjectBtn").addEventListener("click", addProject);
  $("#exportCsvBtn").addEventListener("click", () => Inventory.exportCsv());
  $("#searchInput").addEventListener("input", renderInventory);

  $$(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => setPage(btn.dataset.page));
  });
});
