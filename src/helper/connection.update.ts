import { DisconnectReason, type ConnectionState, type WASocket } from "@whiskeysockets/baileys";

export const connected = (connection: ConnectionState["connection"],lastDisconnect: ConnectionState["lastDisconnect"], connectToWhatsApp: () => Promise<WASocket>) => {
    if (connection === "open") {
        console.log("✅ WhatsApp Connected");
    }

    if (connection === "close") {
        const isLoggedOut = (lastDisconnect?.error as any)?.output?.statusCode === DisconnectReason.loggedOut;

        if (isLoggedOut) {
            console.log("🚪 Logged out, please scan QR again.");
        } else {
            console.log("🔄 Reconnecting...");

            setTimeout(() => {
                connectToWhatsApp();
            }, 3000);
        }
    }
}