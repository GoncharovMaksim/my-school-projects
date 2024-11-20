'use client'
import DropdownMenu from "../components/DropdownMenu";
import { useState } from "react";
export default function Home() {
	const [selectedOption, setSelectedOption] = useState('');
const handleAccountSettings = () => alert('Account settings clicked!');
const handleSupport = () => alert('Support clicked!');
const handleSignOut = () => alert('Sign out clicked!');
	const handleChange = event => {
		setSelectedOption(event.target.value);
		// Вы можете вызвать другие функции, основываясь на выбранном значении
		console.log(`Выбранный вариант: ${event.target.value}`);
	};

	return (
		<div>
		<div>
			<select
				className='select select-bordered w-full max-w-xs bg-gray-200'
				value={selectedOption}
				onChange={handleChange}
			>
				<option disabled selected>
					Who shot first?
				</option>
				<option value='Han Solo'>Han Solo</option>
				<option value='Greedo'>Greedo</option>
			</select>

			<p>Выбранный вариант: {selectedOption}</p>
		</div>
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
			<button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
				Button
			</button>
			<div>
				<button className='px-4 py-2 border border-gray-300 text-gray-700 bg-transparent rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500'>
					МАТЕМАТИКА
				</button>
				<input
					type='text'
					placeholder='Type here'
					className='input input-bordered w-full max-w-xs'
				/>
				<select className='select select-bordered w-full max-w-xs bg-gray-200'>
					<option disabled selected>
						Who shot first?
					</option>
					<option>Han Solo</option>
					<option>Greedo</option>
				</select>
			</div>
			</div>
	);
}