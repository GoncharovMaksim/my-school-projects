'use client';
import { createContext, useState, useContext, useEffect } from 'react';

type ThemeContextType = {
	darkTheme: boolean;
	setDarkTheme: React.Dispatch<React.SetStateAction<boolean>>;
};

const ThemeContext = createContext<ThemeContextType>({
	darkTheme: true,
	setDarkTheme: () => {}, // Пустая функция по умолчанию
});

export default function ThemeProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [darkTheme, setDarkTheme] = useState(true);

	// Восстановление состояния темы из localStorage
	useEffect(() => {
		const savedTheme = localStorage.getItem('darkTheme');
		if (savedTheme !== null) {
			setDarkTheme(JSON.parse(savedTheme));
		}
	}, []);

	// Сохранение состояния темы в localStorage
	useEffect(() => {
		localStorage.setItem('darkTheme', JSON.stringify(darkTheme));
	}, [darkTheme]);

	return (
		<div
			className={
				darkTheme ? 'bg-gray-800 min-h-screen' : 'bg-gray-200 min-h-screen'
			}
			data-theme={darkTheme ? 'dark' : undefined}
		>
			<ThemeContext.Provider value={{ darkTheme, setDarkTheme }}>
				{children}
			</ThemeContext.Provider>
		</div>
	);
}

// Хук для получения значения и функции
export function useTheme() {
	return useContext(ThemeContext);
}
