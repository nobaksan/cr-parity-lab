// stackchan-muse 릴레이를 부르는 얇은 클라이언트
import { relay } from "stackchan-muse/tts-relay";

export async function speak(text: string) {
  return relay.send({ text });
}
