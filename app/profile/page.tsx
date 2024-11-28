import { getServerSession } from "next-auth"
import { authConfig } from "../configs/auth"
export default async function Profile(){
  const session= await getServerSession(authConfig)
  return (
		<div>
			<h1> Профиль {session?.user?.name}</h1>
			<h3>{session?.user?.email}</h3>
			{session?.user?.image && <img src='session.user.image' alt='' />}
		</div>
	);
}