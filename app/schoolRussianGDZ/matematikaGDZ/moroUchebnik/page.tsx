'use client';
import tasks from './moro_matematika_4-klass_tasks.json';
import parse from 'html-react-parser';
import styles from '../../page.module.css'; 
import useLocalStorage from '../../useLocalStorage';
import { useState } from 'react';



const tasksArray = tasks as Array<{
  pageTitle: string;
  number: number;
  page: number;
  taskIndex: number;
  part: number;
  title: string;
  condition: { html: string };
  solutions: Array<{ html: string }>;
}>;

export default function App() {
  const [currentPart, setCurrentPart] = useLocalStorage('currentPartMathGDZ', '1');
  const [currentPage, setCurrentPage] = useLocalStorage('currentPageMathGDZ', '5');
  const [currentTask, setCurrentTask] =  useState('');

  const filteredTasks = tasksArray.filter(
    task =>
      task.page === Number(currentPage) &&
      task.part === Number(currentPart) &&
      (!currentTask || task.number === Number(currentTask))
  );
  
  const handleFilteredPart = (part: string) => setCurrentPart(part);
  const handleFilteredPage = (page: string) => setCurrentPage(page);
  const handleFilteredTask = (task: string) => setCurrentTask(task);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{filteredTasks[0]?.pageTitle}</h1>

      <label htmlFor="" className={styles.input}>
        Часть:
        <input
          type="number"
          placeholder="Часть учебника"
          value={currentPart}
          onChange={el => handleFilteredPart(el.target.value)}
        />
      </label>
      <label htmlFor="" className={styles.input}>
        Страница:
        <input
          type="number"
          placeholder="Страница учебника"
          value={currentPage}
          onChange={el => handleFilteredPage(el.target.value)}
        />
      </label>
      <label htmlFor="" className={styles.input}>
        Задание:
        <input
          type="number"
          placeholder="Номер задания"
          value={currentTask}
          onChange={el => handleFilteredTask(el.target.value)}
        />
      </label>

      {filteredTasks.map(task => (
        <div key={`${task.page}-${task.taskIndex}-${task.part}`}>
          <h2>{task.title}</h2>
          {parse(task.condition.html)}

          <div className={styles.taskSolution}>
            <h3>Решение:</h3>
            {task.solutions.map((solution, index) => (
              <div key={`${task.page}-${task.taskIndex}-${task.part}-${index}`}>
                {parse(solution.html)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
