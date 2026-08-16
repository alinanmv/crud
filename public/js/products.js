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

FilePond.registerPlugin(
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
);

const pond = FilePond.create(document.getElementById("image"), {
  acceptedFileTypes: ["image/*"],
  maxFileSize: "2MB",
  labelIdle:
    'Drag & drop an image or <span class="filepond--label-action">Browse</span> (max 2 MB)',
  labelMaxFileSizeExceeded: "File is too large",
  labelMaxFileSize: "Maximum size is 2 MB",
});

const form = document.getElementById("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const file = pond.getFile();

  const formData = new FormData();
  formData.append("name", document.getElementById("name").value);
  formData.append("price", document.getElementById("price").value);
  formData.append("quantity", document.getElementById("quantity").value);
  if (file) {
    formData.append("image", file.file);
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
