import cronPushNotification from "@/app/pushNotification/cronPushNotification";

export async function GET() {
	

  const result= cronPushNotification();
	

	// Верните ответ
	return new Response(JSON.stringify(result), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}
