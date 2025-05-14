// functions/src/index.ts
import {initializeApp} from "firebase-admin/app";
import {getMessaging} from "firebase-admin/messaging";
import {
  Change,
  DocumentSnapshot,
  onDocumentWritten,
} from "firebase-functions/v2/firestore";

initializeApp();

/**
 * Envía una notificación FCM al topic "global" cuando se crea
 * o actualiza cualquier documento en la colección "players".
 */
export const notifyOnPostWrite = onDocumentWritten(
  {
    document: "players/{postId}",
    region: "europe-west1",
  },
  async (event) => {
    const change: Change<DocumentSnapshot> | undefined = event.data;
    if (!change) {
      return;
    }

    const after = change.after;
    if (!after.exists) {
      return;
    }

    const title = after.get("title") ?? "Información modificada";
    const body = after.get("excerpt") ?? "Que lo sepas";

    const message = {
      notification: {title, body},
      topic: "global",
      data: {
        postId: event.params.postId,
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },
    };

    const id = await getMessaging().send(message);
    console.log("Notificación enviada. ID:", id);
  },
);
