import { DisconnectReason, type ConnectionState } from "baileys";

export type DisconnectHandler = (loggedOut: boolean) => void | Promise<void>;

export const connected = (
  connection: ConnectionState["connection"],
  lastDisconnect: ConnectionState["lastDisconnect"],
  onDisconnect: DisconnectHandler
) => {
  if (connection === "open") {
    console.log("✅ WhatsApp Connected");
    return;
  }

  if (connection === "close") {
    const isLoggedOut =
      (lastDisconnect?.error as any)?.output?.statusCode ===
      DisconnectReason.loggedOut;

    void onDisconnect(isLoggedOut);
  }
};
