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
					<MenuButton className='inline-flex w-full justify-center gap-x-1.5 rounded-md bg-base px-6 py-3 text-xl font-semibold text-base-900 shadow-sm ring-1 ring-inset ring-base-content hover:bg-base-50 min-w-[280px]'>
						{selectedLabel}
						<ChevronDownIcon
							aria-hidden='true'
							className='-mr-1 h-6 w-6 text-base-400'
						/>
					</MenuButton>
				</div>

				{/* Обновленные MenuItems */}
				<MenuItems className='absolute mt-2 w-full origin-top-right rounded-md bg-base-100 shadow-lg ring-1 ring-black/5 focus:outline-none text-lg min-w-[280px] z-10 max-h-48 overflow-y-auto'>
					<div className='py-1'>
						{options.map((option, index) => (
							<MenuItem key={index}>
								{({ active }) => (
									<button
										onClick={() => handleSelect(option.label, option.onClick)}
										className={`block w-full px-6 py-3 text-left text-lg ${
											active ? 'bg-base-200' : 'text-base-400'
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
