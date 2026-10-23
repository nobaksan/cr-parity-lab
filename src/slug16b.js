// 제목을 URL 슬러그로 바꾼다 — 공백은 하이픈으로.
export function slugify(title) {
  return title.trim().toLowerCase().replace(/\s+/g, "-");
}
