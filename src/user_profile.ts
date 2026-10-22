// 사용자 프로필 조회(s10e L5)
export function loadUserProfile(rawId: string) {
  console.log("프로필 조회", rawId);
  const id = parseInt(rawId);
  const res_profile = { id, name: `user-${id}` };
  return res_profile;
}

export function listUserProfiles(rawIds: string[]) {
  return rawIds.map((rawId) => loadUserProfile(rawId));
}
