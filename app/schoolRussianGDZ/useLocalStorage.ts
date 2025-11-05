'use client';

import { useState, useEffect } from 'react';

export default function useLocalStorage<T>(key: string, initialValue: T) {

  const [storedValue, setStoredValue] = useState<T>(initialValue);


  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        if (typeof initialValue === 'string') {
          setStoredValue(item as T);
        } else {
          setStoredValue(JSON.parse(item));
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [key, initialValue]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        if (typeof valueToStore === 'string') {
          window.localStorage.setItem(key, valueToStore);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
