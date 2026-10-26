export interface Connection { connect(): void; disconnect(): void }
export function createConnection(serverUrl: string, roomId: string): Connection {
  return {
    connect() { console.log(`connect ${serverUrl} ${roomId}`); },
    disconnect() { console.log(`disconnect ${serverUrl} ${roomId}`); },
  };
}
