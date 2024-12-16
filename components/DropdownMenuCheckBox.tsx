'use client';

import { useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface DropdownMenuProps {
	options: { label: string; value: string }[]; // Список опций
	defaultLabel?: string; // Текст кнопки по умолчанию
	onChange?: (selectedValues: string[]) => void; // Функция для обработки изменений
}

export default function DropdownMenuCheckBox({
	options,
	defaultLabel = 'Select options',
	onChange,
}: DropdownMenuProps) {
	const [selectedValues, setSelectedValues] = useState<string[]>([]);

	const handleToggleSelection = (value: string) => {
		setSelectedValues(prevSelected => {
			const newSelected = prevSelected.includes(value)
				? prevSelected.filter(v => v !== value)
				: [...prevSelected, value];
			onChange?.(newSelected); // Вызываем callback, если он передан
			return newSelected;
		});
	};

	const selectedLabel = selectedValues.length
		? `Selected: ${selectedValues.join(', ')}`
		: defaultLabel;

	return (
		<div className='relative inline-block text-left'>
			<Menu>
				<div>
					<MenuButton className='inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-6 py-3 text-xl font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 min-w-[280px]'>
						{selectedLabel}
						<ChevronDownIcon
							aria-hidden='true'
							className='-mr-1 h-6 w-6 text-gray-400'
						/>
					</MenuButton>
				</div>

				<MenuItems className='absolute mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none text-lg min-w-[280px] z-10 max-h-48 overflow-y-auto'>
					<div className='py-1'>
						{options.map((option, index) => (
							<MenuItem key={index}>
								{({ active }) => (
									<button
										onClick={() => handleToggleSelection(option.value)}
										className={`block w-full px-6 py-3 text-left text-lg flex items-center ${
											active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
										}`}
									>
										<input
											type='checkbox'
											checked={selectedValues.includes(option.value)}
											readOnly
											className='mr-2'
										/>
										{option.label}
									</button>
								)}
							</MenuItem>
						))}
					</div>
				</MenuItems>
			</Menu>
		</div>
	);
}
