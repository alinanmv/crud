async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return false;

  const response = await fetch("/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: refreshToken }),
  });

  if (!response.ok) return false;

  const data = await response.json();
  localStorage.setItem("token", data.accessToken);
  return true;
}

function logoutRedirect() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  window.location.href = "/";
}

async function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(url, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${token}` },
  });

  if (response.status !== 403) return response;

  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    logoutRedirect();
    return response;
  }

  const newToken = localStorage.getItem("token");
  return fetch(url, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${newToken}` },
  });
}
