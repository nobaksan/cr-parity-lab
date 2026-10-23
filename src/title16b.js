// 제목의 첫 글자를 대문자로 바꾼다.
export function capitalize(title) {
  return title.charAt(0).toUpperCase() + title.slice(1);
}
