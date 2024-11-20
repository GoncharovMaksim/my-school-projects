'use client'
import DropdownMenu from "../components/DropdownMenu";

export default function Home() {
	const handleAccountSettings = () => alert('Account settings clicked!');
	const handleSupport = () => alert('Support clicked!');
	const handleSignOut = () => alert('Sign out clicked!');

	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center '>
			<div className='p-8'>
				<h1 className='text-2xl text-center font-bold mb-4'>Математика</h1>
				<DropdownMenu
					defaultLabel='Выберите действие'
					options={[
						{ label: 'Умножение', onClick: handleAccountSettings },
						{ label: 'Сложение', onClick: handleSupport },
						{ label: 'Вычитание', onClick: handleSignOut },
						{ label: 'Деление', onClick: handleSignOut },
					]}
				/>
			</div>
		</div>
	);
}
