const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/";
}

async function init() {
  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    logoutRedirect();
  }
}

init();

const form = document.getElementById("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const quantity = document.getElementById("quantity").value;

  const response = await authFetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price, quantity }),
  });

  if (response.ok) {
    window.location.href = "products.html";
  } else {
    const data = await response.json();
    alert(data.error);
  }
});
