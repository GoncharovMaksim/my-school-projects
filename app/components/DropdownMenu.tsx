'use client';

import { useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface DropdownMenuProps {
	options: { label: string; onClick?: () => void }[]; // Список опций
	defaultLabel?: string; // Текст кнопки по умолчанию
}

export default function DropdownMenu({
	options,
	defaultLabel = 'Options',
}: DropdownMenuProps) {
	const [selectedLabel, setSelectedLabel] = useState(defaultLabel);

	const handleSelect = (label: string, onClick?: () => void) => {
		setSelectedLabel(label); // Обновляем текст кнопки
		if (onClick) {
			onClick(); // Вызываем пользовательскую функцию
		}
	};

	return (
		<div className='relative inline-block text-left'>
			<Menu>
				<div>
					<MenuButton className='inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'>
						{selectedLabel}
						<ChevronDownIcon
							aria-hidden='true'
							className='-mr-1 size-5 text-gray-400'
						/>
					</MenuButton>
				</div>

				<MenuItems
					className='absolute mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'
					style={{ top: '100%', left: 0 }}
				>
					<div className='py-1'>
						{options.map((option, index) => (
							<MenuItem key={index}>
								{({ active }) => (
									<button
										onClick={() => handleSelect(option.label, option.onClick)}
										className={`block w-full px-4 py-2 text-left text-sm ${
											active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
										}`}
									>
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
