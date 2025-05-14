const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// 🔔 Enviar notificación cuando se escriba en 'players'
exports.sendNotificationOnPlayerChange = functions.firestore
  .document("players/{playerId}")
  .onWrite(async (change, context) => {
    const payload = {
      notification: {
        title: "🏀 Actualización de jugador",
        body: "Se ha añadido o modificado un jugador en la base de datos.",
      },
      topic: "global", // Se enviará a todos los dispositivos suscritos
    };

    try {
      const response = await admin.messaging().send(payload);
      console.log("✅ Notificación enviada:", response);
    } catch (error) {
      console.error("❌ Error al enviar notificación:", error);
    }
  });
