import webPush from "web-push";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (publicKey && privateKey && privateKey !== "YOUR_VAPID_PRIVATE_KEY") {
  try {
    webPush.setVapidDetails(
      "mailto:no-reply@suviidiary.app",
      publicKey,
      privateKey
    );
  } catch (error) {
    console.warn("VAPID details not initialized:", error);
  }
}

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  url?: string;
}

export async function sendWebPushNotification(subscription: webPush.PushSubscription, payload: PushPayload) {
  if (!publicKey || !privateKey || privateKey === "YOUR_VAPID_PRIVATE_KEY") {
    console.log("[Web Push Simulated]", payload.title, payload.body);
    return { success: true, simulated: true };
  }

  try {
    const result = await webPush.sendNotification(subscription, JSON.stringify(payload));
    return { success: true, result };
  } catch (error) {
    console.error("Web Push failed:", error);
    return { success: false, error };
  }
}
