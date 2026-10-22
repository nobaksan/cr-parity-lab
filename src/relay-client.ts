// TTS 릴레이 호출 클라이언트
export async function postToRelay(server: string, text: string) {
  const res = await fetch(`${server}/tts`, { method: "POST", body: JSON.stringify({ text }) });
  return res.json();
}

export function relayUrl(server: string, path: string) {
  return server + path;
}

export function relayHealth(server: string) {
  return fetch(`${server}/health`).then((r) => r.ok);
}

export const RELAY_TIMEOUT_MS = 5000;
