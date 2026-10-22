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

export function print_profile_summary(res_profile: { id: number; name: string }) {
  console.log("요약", res_profile.id, res_profile.name);
  return `${res_profile.id}:${res_profile.name}`;
}
