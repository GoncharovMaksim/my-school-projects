export default function StartGame({ gameSettings }: { gameSettings: { operator: string; difficultyLevel: number } }) {
	console.log(gameSettings);
	const { operator, difficultyLevel } = gameSettings;
	return (
		<div>
			<h1>Game Started</h1>
			<p>Operator: {operator}</p>
			<p>Difficulty Level: {difficultyLevel}</p>
		</div>
	);
}
