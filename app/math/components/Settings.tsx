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

				
			
		</>
	);
}
