
import filterCronPushNotificationEnglish from "@/app/pushNotification/filterCronPushNotificationEnglish";

import filterCronPushNotificationMath from "@/app/pushNotification/filterCronPushNotificationMath";

export async function GET() {
	

  const resultMath= await filterCronPushNotificationMath();
	const resultEnglish = await filterCronPushNotificationEnglish();

	// Верните ответ
	const combinedResult = { resultMath, resultEnglish };
	return new Response(JSON.stringify(combinedResult), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}
