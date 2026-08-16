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

  const image = document.getElementById("image").files[0];

  const formData = new FormData();
  formData.append("name", document.getElementById("name").value);
  formData.append("price", document.getElementById("price").value);
  formData.append("quantity", document.getElementById("quantity").value);
  if (image) {
    formData.append("image", image);
  }

  const response = await authFetch("/api/products", {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    window.location.href = "products.html";
  } else {
    const data = await response.json();
    alert(data.error);
  }
});
