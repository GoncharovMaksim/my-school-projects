'use client';

import { useEffect, useState } from 'react';
import Test from '../schoolRussianGDZ/test';
import getOptionsList from '../schoolRussianGDZ/getOptionsList';
import styles from './page.module.css';
import DropdownMenu from '@/components/DropdownMenu';
import tasks from './moro_part1_tasks.json';
interface OptionItem {
  topic: string;
  part: number[];
}

export default function App() {
  const [isLoading, setisLoading] = useState(true);
  const [optionsList, setOptionsList] = useState<OptionItem[]>([]);
  const [userCheckOptions, setUserCheckOptions] = useState<string>('');
  const [dropdownLabel, setDropdownLabel] = useState<string>('');
  const [selectedPart, setSelectedPart] = useState<string>('');
  const [selectedPartLabel, setSelectedPartLabel] = useState<string>('');
  const [startTests, setStartTest] = useState<boolean>(false);

  useEffect(() => {
    getOptionsList().then(response => {
      console.log('!response', response);
      setOptionsList(response);
      // Получаем сохранённую опцию из localStorage
      const savedOption =
        typeof window !== 'undefined'
          ? localStorage.getItem('mathTestsOption')
          : null;
      const initialOption =
        savedOption &&
        response.some((item: OptionItem) => item.topic === savedOption)
          ? savedOption
          : response[0]?.topic || '';

      // Часть по умолчанию не выбрана
      const initialPart = '';
      const initialPartLabel = '';

      setUserCheckOptions(initialOption);
      setDropdownLabel(initialOption);
      setSelectedPart(initialPart);
      setSelectedPartLabel(initialPartLabel);
      setisLoading(false);
    });
  }, []);

  const handleChange = (
    optionOrEvent:
      | { label: string; value?: string }
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    let value = '';
    if (typeof optionOrEvent === 'object' && 'label' in optionOrEvent) {
      value = optionOrEvent.label;
    } else if ('target' in optionOrEvent) {
      value = optionOrEvent.target.value;
    }
    setUserCheckOptions(value);
    setDropdownLabel(value);
    // Сбрасываем выбранную часть при смене темы
    setSelectedPart('');
    setSelectedPartLabel('');
    if (typeof window !== 'undefined') {
      localStorage.setItem('mathTestsOption', value);
    }
  };

  const handlePartChange = (
    optionOrEvent:
      | { label: string; value?: string }
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    let value = '';
    let label = '';
    if (typeof optionOrEvent === 'object' && 'label' in optionOrEvent) {
      // Используем value если есть, иначе извлекаем номер из label
      console.log('!optionOrEvent:', optionOrEvent);
      console.log('!optionOrEvent.value:', optionOrEvent.value);
      console.log('!optionOrEvent.label:', optionOrEvent.label);

      if (optionOrEvent.value !== undefined) {
        value = optionOrEvent.value;
      } else {
        // Извлекаем номер из "Часть X" или оставляем как есть для "Все части"
        if (optionOrEvent.label === 'Все части') {
          value = '';
        } else {
          const match = optionOrEvent.label.match(/Часть (\d+)/);
          value = match ? match[1] : optionOrEvent.label;
        }
      }

      label = optionOrEvent.label;
      console.log('!value', value);
      console.log('!label', label);
    } else if ('target' in optionOrEvent) {
      value = optionOrEvent.target.value;
      console.log('!value', value);
      label = optionOrEvent.target.value;
      console.log('!label', label);
    }
    setSelectedPart(value);
    setSelectedPartLabel(label);
    if (typeof window !== 'undefined') {
      localStorage.setItem('literaturePart', value);
    }
  };

  const handleStartTest = () => {
    setStartTest(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Готовые Домашние Задания
          <br />
          «Школа России»
        </h1>

        {tasks.map(task => (
          <div key={task.number}>
            {/* Условие */}
            {task.condition?.html && (
              <div
                className={styles.taskCondition}
                dangerouslySetInnerHTML={{ __html: task.condition.html }}
              />
            )}

            {/* Теория */}
            {task.theory?.html && (
              <div
                className={styles.taskTheory}
                dangerouslySetInnerHTML={{ __html: task.theory.html }}
              />
            )}

            {/* Решения */}
            {task.solutions?.map((sol, i) => (
              <div key={i} className={styles.taskSolution}>
                <h3>{sol.title}</h3>
                {sol.html && (
                  <div dangerouslySetInnerHTML={{ __html: sol.html }} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return <div className={styles.page}>Загрузка...</div>;
  }
  return !startTests ? (
    <div className="container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center ">
      <div className="my-8 flex flex-col items-center space-y-6">
        <h1 className="text-4xl text-center font-bold mb-4 ">
          Математика <br />
          «Школа России»
        </h1>
        <h3>Выберите тему теста</h3>

        <DropdownMenu
          onChange={handleChange}
          defaultLabel={dropdownLabel}
          options={optionsList.map((option: OptionItem) => ({
            label: option.topic,
          }))}
        />

        {/* Показываем выбор части только если выбрана тема */}
        {dropdownLabel &&
          (() => {
            const partOptions = [
              { label: 'Все части', value: '' }, // Пункт для теста по всей теме
              ...optionsList
                .filter(options => options.topic === dropdownLabel)
                .flatMap(option =>
                  option.part
                    .sort((a, b) => a - b) // Правильная сортировка чисел
                    .map(partNumber => ({
                      label: `Часть ${partNumber}`,
                      value: partNumber.toString(), // Добавляем отдельное поле для значения
                    }))
                ),
            ];

            return (
              <DropdownMenu
                onChange={handlePartChange}
                defaultLabel={selectedPartLabel || 'Выберите часть'}
                options={partOptions}
              />
            );
          })()}

        <button
          // className="btn btn-outline w-full max-w-xs"
          className="btn btn-outline min-w-[280px]"
          onClick={handleStartTest}
          disabled={!dropdownLabel}
        >
          Начать тест
        </button>
      </div>
    </div>
  ) : (
    <Test
      userCheckOptions={
        selectedPart
          ? `topic=${userCheckOptions}&part=${selectedPart}`
          : `topic=${userCheckOptions}`
      }
      setStartTest={setStartTest}
    />
  );
}
