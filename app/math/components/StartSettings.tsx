import DropdownMenu from '../../components/DropdownMenu';

export default function StartSettings() {
	const handleAccountSettings = () => alert('Account settings clicked!');
	const handleSupport = () => alert('Support clicked!');
	const handleSignOut = () => alert('Sign out clicked!');

	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center '>
			<div className='p-8 flex flex-col items-center space-y-6'>
				<h1 className='text-4xl text-center font-bold mb-4'>Математика</h1>
				<DropdownMenu
					defaultLabel='Выберите действие'
					options={[
						{ label: 'Умножение', onClick: handleAccountSettings },
						{ label: 'Сложение', onClick: handleSupport },
						{ label: 'Вычитание', onClick: handleSignOut },
						{ label: 'Деление', onClick: handleSignOut },
					]}
				/>
				<DropdownMenu
					defaultLabel='Выберите сложность'
					options={[
						{ label: 'Уровень 1', onClick: handleAccountSettings },
						{ label: 'Уровень 2', onClick: handleSupport },
						{ label: 'Уровень 3', onClick: handleSignOut },
					]}
				/>
			</div>

			<button className='btn btn-outline w-full max-w-xs'>Начать</button>

			<input
				type='text'
				placeholder='Type here'
				className='input input-bordered w-full max-w-xs'
			/>
		</div>
	);
}
