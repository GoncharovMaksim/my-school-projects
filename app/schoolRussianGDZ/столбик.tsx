'use client';
import { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import styles from './page.module.css';
import tasks from './moro_part1_tasks.json';
import React from 'react'; // Added missing import for React

interface Task {
  number: string;
  title: string;
  condition?: {
    text: string;
    html?: string;
    images?: {
      remote: string;
      local: string;
    }[];
  };
  theory?: {
    text: string;
    html?: string;
    images?: {
      remote: string;
      local: string;
    }[];
  };
  solutions?: {
    title: string;
    html?: string;
    blocks?: {
      type: string;
      value: string;
      remote?: string;
      local?: string;
    }[];
  }[];
}

// Компоненты для специальных математических конструкций

const ColumnOperation = ({
  sign,
  x,
  y,
  z,
}: {
  sign: string;
  x: number;
  y: number;
  z?: number;
}) => {
  const arrayContent =
    z !== undefined
      ? `\\begin{array}{r}${x}\\\\${sign} ${y}\\\\\\hline ${z}\\end{array}`
      : `\\begin{array}{r}${x}\\\\${sign} ${y}\\end{array}`;
  return <BlockMath>{arrayContent}</BlockMath>;
};

// Новый компонент для многострочных операций
const ColumnRowsOperation = ({
  args,
  solution,
}: {
  args: string[];
  solution: string;
}) => {
  // Создаем массив строк для LaTeX
  const rows = args.map(arg => arg.replace(/^\+/, '')); // Убираем + в начале
  const arrayContent = `\\begin{array}{r}${rows.join(
    '\\\\'
  )}\\\\\\hline ${solution}\\end{array}`;
  return <BlockMath>{arrayContent}</BlockMath>;
};

// Новый компонент для умножения в столбик
const ColumnMultiplication = ({ x, y }: { x: number; y: number }) => {
  const result = x * y;
  const arrayContent = `\\begin{array}{r}${x}\\\\× ${y}\\\\\\hline ${result}\\end{array}`;
  return <BlockMath>{arrayContent}</BlockMath>;
};

// Новый компонент для деления в столбик с полными промежуточными шагами
const LongDivision = ({ x, y }: { x: number; y: number }) => {
  const quotient = Math.floor(x / y);

  // Создаем полный алгоритм деления в столбик
  const createSteps = () => {
    const dividend = x.toString();
    const divisor = y;
    const steps = [];

    let current = 0;
    let position = 0;

    // Проходим по цифрам делимого
    while (position < dividend.length) {
      // Берем следующую цифру
      current = current * 10 + parseInt(dividend[position]);

      if (current >= divisor) {
        const digit = Math.floor(current / divisor);
        const product = digit * divisor;

        // Добавляем шаги
        steps.push(current.toString());
        steps.push(`\\underline{${product}}`);

        current = current % divisor;

        if (current > 0 && position < dividend.length - 1) {
          steps.push(current.toString());
        }
      }
      position++;
    }

    // Финальный остаток
    steps.push(current.toString());

    return steps.join(' \\\\ ');
  };

  const stepsStr = createSteps();
  const arrayContent = `\\begin{array}{r}
    ${x} \\\\
    \\overline{${y}} \\\\
    ${stepsStr} \\\\
    ${quotient}
  \\end{array}`;

  return <BlockMath>{arrayContent}</BlockMath>;
};

// Новый компонент для деления в столбик с "уголком" как в учебнике
const LongDivisionVisual = ({ x, y }: { x: number; y: number }) => {
  const dividendDigits = x.toString().split('');
  const divisor = y;
  let steps: {
    partial: number;
    subtract: number;
    remainder: number;
    pos: number;
    digit: number;
    showDigit: boolean;
    bringDown?: number;
  }[] = [];
  let current = 0;
  let quotient = '';
  let firstStep = true;

  for (let i = 0; i < dividendDigits.length; i++) {
    current = current * 10 + Number(dividendDigits[i]);
    let showDigit = false;
    let bringDown = undefined;
    if (current >= divisor) {
      const digit = Math.floor(current / divisor);
      const subtract = digit * divisor;
      const remainder = current - subtract;
      if (i + 1 < dividendDigits.length) {
        bringDown = Number(dividendDigits[i + 1]);
      }
      steps.push({
        partial: current,
        subtract,
        remainder,
        pos: i,
        digit,
        showDigit: true,
        bringDown,
      });
      quotient += digit.toString();
      current = remainder;
      firstStep = false;
    } else {
      if (!firstStep) {
        quotient += '0';
        if (i + 1 < dividendDigits.length) {
          bringDown = Number(dividendDigits[i + 1]);
        }
        steps.push({
          partial: current,
          subtract: 0,
          remainder: current,
          pos: i,
          digit: 0,
          showDigit: false,
          bringDown,
        });
      }
    }
  }
  if (quotient === '') quotient = '0';

  const dividendStr = x.toString();
  const quotientStr = quotient;

  return (
    <div
      style={{
        fontFamily: 'monospace',
        display: 'inline-block',
        lineHeight: 1.2,
      }}
    >
      {/* Верхняя строка: делимое и делитель */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}
      >
        <span
          style={{
            minWidth: `${dividendStr.length}ch`,
            textAlign: 'right',
            fontWeight: 'bold',
          }}
        >
          {dividendStr}
        </span>
        <span
          style={{
            marginLeft: '1.5ch',
            minWidth: '2ch',
            textAlign: 'left',
            fontWeight: 'bold',
          }}
        >
          {divisor}
        </span>
      </div>
      {/* Вторая строка: частное под делителем */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
      >
        <span style={{ minWidth: `${dividendStr.length}ch` }}></span>
        <span
          style={{
            marginLeft: '1.5ch',
            minWidth: '2ch',
            textAlign: 'left',
            fontWeight: 'bold',
          }}
        >
          {quotientStr}
        </span>
      </div>
      {/* Шаги деления под делимым */}
      <div style={{ marginLeft: 0, marginTop: 2 }}>
        {steps.map((step, idx) => (
          <div key={idx} style={{ minHeight: '1em' }}>
            {/* Вычитание */}
            <span
              style={{
                display: 'block',
                textAlign: 'left',
                minWidth: `${dividendStr.length}ch`,
              }}
            >
              <span style={{ color: '#888' }}>
                {step.subtract !== 0 ? `${step.subtract}` : ''}
              </span>
            </span>
            {/* Линия после вычитания */}
            <span
              style={{
                display: 'block',
                textAlign: 'left',
                minWidth: `${dividendStr.length}ch`,
                fontWeight: 'bold',
                color: '#888',
              }}
            >
              {idx === 0 ? '¯' : '¯'.repeat(dividendStr.length)}
            </span>
            {/* Остаток и спускаемая цифра */}
            <span
              style={{
                display: 'block',
                textAlign: 'left',
                minWidth: `${dividendStr.length}ch`,
                borderBottom:
                  idx === steps.length - 1 ? '1px solid #888' : undefined,
                marginLeft: `${step.pos}ch`,
              }}
            >
              {step.remainder !== 0 || idx === steps.length - 1
                ? step.remainder
                : ''}
              {typeof step.bringDown === 'number' ? (
                <span
                  style={{
                    color: '#00f',
                    marginLeft: 2,
                    textDecoration: 'underline',
                  }}
                >
                  {step.bringDown}
                </span>
              ) : null}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5; // Показывать 5 задач на страницу

  const renderHTML = (html: string) => {
    if (!html) return null;
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const renderMath = useMemo(() => {
    // Функция для обработки всего текста целиком
    const renderText = (text: string) => {
      if (!text) return null;

      // Сначала обрабатываем сниппеты в $...$ блоках
      const processedText = text.replace(
        /\$\\snippet\{([^}]+)\}\$/g,
        (match, snippetBody) => {
          try {
            // Парсим параметры для op_column
            const nameMatch = snippetBody.match(/name:\s*([^,]+)/);
            const signMatch = snippetBody.match(/sign:\s*['"]?([^'",]+)['"]?/);
            const xMatch = snippetBody.match(/x:\s*(\d+)/);
            const yMatch = snippetBody.match(/y:\s*(\d+)/);
            const zMatch = snippetBody.match(/z:\s*['"]?(\d*)['"]?/);

            // Парсим параметры для op_column_rows
            const argsMatch = snippetBody.match(/args:\s*\[([^\]]+)\]/);
            const solutionMatch = snippetBody.match(
              /solution:\s*['"]?([^'"]+)['"]?/
            );

            const name = nameMatch ? nameMatch[1].trim() : null;

            if (name === 'op_column') {
              const sign = signMatch ? signMatch[1].trim() : null;
              const x = xMatch ? parseInt(xMatch[1]) : null;
              const y = yMatch ? parseInt(yMatch[1]) : null;
              const z = zMatch && zMatch[1] ? parseInt(zMatch[1]) : undefined;

              if (sign && x !== null && y !== null) {
                const id = `snippet_${Math.random().toString(36).substr(2, 9)}`;
                return `__SNIPPET_COLUMN_${id}__:${JSON.stringify({
                  sign,
                  x,
                  y,
                  z,
                })}`;
              }
            } else if (name === 'op_column_rows') {
              const args = argsMatch
                ? argsMatch[1]
                    .split(',')
                    .map(s => s.trim().replace(/['"]/g, ''))
                : [];
              const solution = solutionMatch ? solutionMatch[1].trim() : null;

              if (args.length > 0 && solution) {
                const id = `snippet_${Math.random().toString(36).substr(2, 9)}`;
                return `__SNIPPET_ROWS_${id}__:${JSON.stringify({
                  args,
                  solution,
                })}`;
              }
            } else if (name === 'column_multiplication') {
              const x = xMatch ? parseInt(xMatch[1]) : null;
              const y = yMatch ? parseInt(yMatch[1]) : null;

              if (x !== null && y !== null) {
                const id = `snippet_${Math.random().toString(36).substr(2, 9)}`;
                return `__SNIPPET_MULT_${id}__:${JSON.stringify({ x, y })}`;
              }
            } else if (name === 'long_division') {
              const x = xMatch ? parseInt(xMatch[1]) : null;
              const y = yMatch ? parseInt(yMatch[1]) : null;

              if (x !== null && y !== null) {
                const id = `snippet_${Math.random().toString(36).substr(2, 9)}`;
                return `__SNIPPET_DIV_${id}__:${JSON.stringify({ x, y })}`;
              }
            }
          } catch (e) {
            console.error('Error parsing snippet:', match, e);
          }
          return match; // Возвращаем оригинал, если не удалось распарсить
        }
      );

      // Теперь разбиваем на строки и обрабатываем
      const lines = processedText.split('\n');
      return lines.map((line, lineIndex) => {
        // Обрабатываем оставшиеся $...$ блоки (обычная математика)
        const parts = line.split(/(\${1,2}[^$]+\${1,2})/g);

        const renderedParts = parts.map((part, partIdx) => {
          // Проверяем, является ли это нашим сниппетом для op_column
          const columnMatch = part.match(/__SNIPPET_COLUMN_([^:]+):(.+)/);
          if (columnMatch) {
            try {
              const jsonData = columnMatch[2].replace(/[;,.]*$/, '');
              const data = JSON.parse(jsonData);
              return (
                <ColumnOperation
                  key={`s-${lineIndex}-${partIdx}`}
                  sign={data.sign}
                  x={data.x}
                  y={data.y}
                  z={data.z}
                />
              );
            } catch (e) {
              console.error(
                'Error parsing column snippet data:',
                columnMatch[2],
                e
              );
              return (
                <span
                  key={`e-${lineIndex}-${partIdx}`}
                  style={{ color: 'red' }}
                >
                  {part}
                </span>
              );
            }
          }

          // Проверяем, является ли это нашим сниппетом для op_column_rows
          const rowsMatch = part.match(/__SNIPPET_ROWS_([^:]+):(.+)/);
          if (rowsMatch) {
            try {
              const jsonData = rowsMatch[2].replace(/[;,.]*$/, '');
              const data = JSON.parse(jsonData);
              return (
                <ColumnRowsOperation
                  key={`s-${lineIndex}-${partIdx}`}
                  args={data.args}
                  solution={data.solution}
                />
              );
            } catch (e) {
              console.error(
                'Error parsing rows snippet data:',
                rowsMatch[2],
                e
              );
              return (
                <span
                  key={`e-${lineIndex}-${partIdx}`}
                  style={{ color: 'red' }}
                >
                  {part}
                </span>
              );
            }
          }

          // Проверяем, является ли это нашим сниппетом для column_multiplication
          const multMatch = part.match(/__SNIPPET_MULT_([^:]+):(.+)/);
          if (multMatch) {
            try {
              const jsonData = multMatch[2].replace(/[;,.]*$/, '');
              const data = JSON.parse(jsonData);
              return (
                <ColumnMultiplication
                  key={`s-${lineIndex}-${partIdx}`}
                  x={data.x}
                  y={data.y}
                />
              );
            } catch (e) {
              console.error(
                'Error parsing multiplication snippet data:',
                multMatch[2],
                e
              );
              return (
                <span
                  key={`e-${lineIndex}-${partIdx}`}
                  style={{ color: 'red' }}
                >
                  {part}
                </span>
              );
            }
          }

          // Проверяем, является ли это нашим сниппетом для long_division
          const divMatch = part.match(/__SNIPPET_DIV_([^:]+):(.+)/);
          if (divMatch) {
            try {
              const jsonData = divMatch[2].replace(/[;,.]*$/, '');
              const data = JSON.parse(jsonData);
              return (
                <LongDivisionVisual
                  key={`s-${lineIndex}-${partIdx}`}
                  x={data.x}
                  y={data.y}
                />
              );
            } catch (e) {
              console.error(
                'Error parsing division snippet data:',
                divMatch[2],
                e
              );
              return (
                <span
                  key={`e-${lineIndex}-${partIdx}`}
                  style={{ color: 'red' }}
                >
                  {part}
                </span>
              );
            }
          }

          // Если часть начинается и заканчивается $$ → display‑math
          if (part.startsWith('$$') && part.endsWith('$$')) {
            const formula = part.slice(2, -2);
            return (
              <BlockMath key={`b-${lineIndex}-${partIdx}`}>{formula}</BlockMath>
            );
          }

          // Если часть начинается и заканчивается $ → inline‑math
          if (part.startsWith('$') && part.endsWith('$')) {
            const formula = part.slice(1, -1);
            return (
              <InlineMath key={`i-${lineIndex}-${partIdx}`}>
                {formula}
              </InlineMath>
            );
          }

          // Всё остальное – обычный текст
          return <span key={`t-${lineIndex}-${partIdx}`}>{part}</span>;
        });

        // Проверяем, содержит ли строка математические компоненты
        const hasMathComponents = renderedParts.some(
          part =>
            React.isValidElement(part) &&
            (part.type === BlockMath ||
              part.type === ColumnOperation ||
              part.type === ColumnRowsOperation ||
              part.type === ColumnMultiplication ||
              part.type === LongDivision ||
              part.type === LongDivisionVisual)
        );

        // Используем div для строк с математическими компонентами, p для обычного текста
        const Container = hasMathComponents ? 'div' : 'p';

        return (
          <Container key={lineIndex} style={{ margin: 0 }}>
            {renderedParts}
          </Container>
        );
      });
    };

    // Главная функция, вызываемая из JSX
    const renderFunction = (text: string) => {
      if (!text) return null;
      return <>{renderText(text)}</>;
    };

    renderFunction.displayName = 'renderMath';
    return renderFunction;
  }, []);
  // Пагинация
  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const currentTasks = tasks.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsTheoryOpen(false); // Скрыть теорию при смене страницы
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Готовые Домашние Задания
          <br /> «Школа России»
        </h1>

        {/* Пагинация */}
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Предыдущая
          </button>
          <span>
            Страница {currentPage} из {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Следующая
          </button>
        </div>

        {(currentTasks as Task[]).map((task, index) => (
          <div key={`${index}+${task.number}`}>
            {/* Условие */}
            <h2>{task.title}</h2>
            {task.condition?.text ? (
              <div className={styles.taskCondition}>
                {renderMath(task.condition.text)}
              </div>
            ) : task.condition?.html ? (
              <div className={styles.taskCondition}>
                {renderHTML(task.condition.html)}
              </div>
            ) : null}

            {/* Теория */}
            {task.theory && (
              <div className={styles.taskTheoryBlock}>
                <button
                  className={styles.toggleBtn}
                  onClick={() => setIsTheoryOpen(!isTheoryOpen)}
                >
                  {isTheoryOpen ? 'Скрыть теорию' : 'Показать теорию'}
                </button>

                {isTheoryOpen && (
                  <div className={styles.taskTheory}>
                    {task.theory.text
                      ? renderMath(task.theory.text)
                      : task.theory.html
                      ? renderHTML(task.theory.html)
                      : null}
                  </div>
                )}
              </div>
            )}

            {/* Решения */}
            {task.solutions?.map((sol, i) => (
              <div key={i} className={styles.taskSolution}>
                <h3>{sol.title}</h3>
                {sol.blocks?.length
                  ? sol.blocks.map((block, j) => (
                      <div key={j}>
                        {block.type === 'image' ? (
                          <img src={`/${block.local}`} alt="Решение рисунок" />
                        ) : (
                          renderMath(block.value)
                        )}
                      </div>
                    ))
                  : sol.html
                  ? renderHTML(sol.html)
                  : null}
              </div>
            ))}
          </div>
        ))}

        {/* Пагинация внизу */}
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Предыдущая
          </button>
          <span>
            Страница {currentPage} из {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Следующая
          </button>
        </div>
      </div>
    </div>
  );
}
