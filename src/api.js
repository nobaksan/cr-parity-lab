async function fetch_user(id) {
  const response = await fetch(`/api/users/${id}`);
  const user = await response.json();
  return user;
}

async function fetch_list() {
  const result = await fetch("/api/list");
  return result.json();
}

export { fetch_user, fetch_list };
