'use client'
import { createContext, useState, useContext } from 'react';

type ThemeContextType = {
	darkTheme: boolean;
	setDarkTheme: React.Dispatch<React.SetStateAction<boolean>>;
};

const ThemeContext = createContext<ThemeContextType|null>(null);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [darkTheme, setDarkTheme] = useState(true);
	return (
		<div
			className={darkTheme ? 'bg-gray-900' : 'bg-gray-200'}
			data-theme={darkTheme ? 'dark' : undefined}
		>
			<ThemeContext.Provider value={{ darkTheme, setDarkTheme }}>
				{children}
			</ThemeContext.Provider>
		</div>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}