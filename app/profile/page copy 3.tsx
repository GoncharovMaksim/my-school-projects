'use client'


import { getServerSession } from 'next-auth';
import { authConfig } from '../../configs/auth';
import Image from 'next/image';
import { useSession } from 'next-auth/react';


export default function Profile() {
	const session =  useSession();
	const userImage = session?.user?.image?session?.user?.image:'';

	const saveNewPassword= function(inputValue) {
		console.log(inputValue)
		return inputValue;
	}
	
	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center'>
			<div className='p-8 flex flex-col items-center space-y-6'>
				<h1 className='text-4xl text-center font-bold mb-4'>Профиль</h1>
				<div>
					{session?.user?.image && (
						<Image
							src={userImage}
							alt=''
							width={500}
							height={500}
							className='inline-block size-24 rounded-full ring-2 ring-white'
						/>
					)}
				</div>

				<div>
					<p> Имя: {session?.user?.name}</p>
					<p> Никнейм : {session?.user?.nickName}</p>
					<p> Почта: {session?.user?.email}</p>
				</div>
				<div className='flex flex-col space-y-4'>
					<label>Изменить пароль:</label>
					<input
						type='text'
						//value={}
						className='input input-bordered w-full max-w-xs'
						placeholder='новый пароль'
					/>
					<button className='btn btn-outline' onClick={()=>saveNewPassword('ntcn')}>
						Сохранить
					</button>
				</div>
			</div>
		</div>
	);
}
