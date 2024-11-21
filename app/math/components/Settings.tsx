import DropdownMenu from '../../components/DropdownMenu';

export default function StartSettings({
	setGameSettings,
	setStartGame,
}: {
	setGameSettings: React.Dispatch<
		React.SetStateAction<{ operator: string; difficultyLevel: number }>
	>;
	setStartGame: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const settingsGame = {
		operator: '*',
		difficultyLevel: 1,
	};

	return (
		<>
			<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center '>
				<div className='p-8 flex flex-col items-center space-y-6'>
					<h1 className='text-4xl text-center font-bold mb-4'>Математика</h1>
					<DropdownMenu
						defaultLabel='Выберите действие'
						options={[
							{
								label: 'Умножение',
								onClick: () => (settingsGame.operator = '*'),
							},
							{
								label: 'Сложение',
								onClick: () => (settingsGame.operator = '+'),
							},
							{
								label: 'Вычитание',
								onClick: () => (settingsGame.operator = '-'),
							},
							{
								label: 'Деление',
								onClick: () => (settingsGame.operator = '/'),
							},
						]}
					/>
					<DropdownMenu
						defaultLabel='Выберите сложность'
						options={[
							{
								label: 'Уровень 1',
								onClick: () => (settingsGame.difficultyLevel = 1),
							},
							{
								label: 'Уровень 2',
								onClick: () => (settingsGame.difficultyLevel = 2),
							},
							{
								label: 'Уровень 3',
								onClick: () => (settingsGame.difficultyLevel = 3),
							},
						]}
					/>
				</div>

				<button
					className='btn btn-outline w-full max-w-xs'
					onClick={() => {
						setGameSettings(settingsGame);
						setStartGame(true);
						console.log(settingsGame);
					}}
				>
					Начать
				</button>

				<input
					type='text'
					placeholder='Type here'
					className='input input-bordered w-full max-w-xs'
				/>
			</div>
		</>
	);
}
