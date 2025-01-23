import { sendNotification } from "./actions";

export default async function cronPushNotification(){
  const message='Дорогой друг! Не забудь позаниматься!';
  const userId=''
  await sendNotification(message, userId);
  const result = { success: true, message: 'Задача выполнена успешно!' };
  return result
}