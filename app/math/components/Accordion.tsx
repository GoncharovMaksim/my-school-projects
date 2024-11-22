import { useState, useEffect } from 'react';

export default function Accordion() {
	const [sheetsList, setSheetsList] = useState([1,2,3]);

	// useEffect(() => {
	// 	async function fetchData() {
	// 		const sheets = await apiGet();
	// 		setSheetsList(sheets);
	// 	}
	// 	fetchData();
	// }, []);

	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm'>
			<div className='collapse collapse-arrow bg-base-200'>
				<input type='checkbox' name='my-accordion-2' />
				<div className='collapse-title text-xl font-medium'>sheetTitle</div>
				<div className='collapse-content'>
					<p >rtyr</p>
				</div>
			</div>
		</div>
	);
}
