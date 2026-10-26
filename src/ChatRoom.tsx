import { useEffect, useState } from "react";
import { createConnection } from "./chat";

/** 채팅방 연결 — roomId 가 바뀌면 다시 연결한다 */
export function ChatRoom({ roomId }: { roomId: string }) {
  const [serverUrl] = useState("https://localhost:1234");

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, [serverUrl, roomId]);

  return <h1>{roomId} 채팅방</h1>;
}
