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

// Удаляю компонент LongDivisionVisual

export default function App() {
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5; // Показывать 5 задач на страницу

  const renderHTML = (html: string) => {
    if (!html) return null;
    // Нормализуем локальные пути изображений без ведущего слеша
    const normalizedHtml = html
      .replace(/src="imagesGDZ\//g, 'src="/imagesGDZ/')
      .replace(/src='imagesGDZ\//g, "src='/imagesGDZ/");
    return <div dangerouslySetInnerHTML={{ __html: normalizedHtml }} />;
  };

  const renderMath = useMemo(() => {
    // Оборачивает кириллические слова в \\text{...} внутри формул
    const sanitizeMath = (input: string) => {
      return input.replace(/[А-Яа-яЁё]+/g, match => `\\text{${match}}`);
    };

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
                    .map((s: string) => s.trim().replace(/['"]/g, ''))
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
                <span key={`s-${lineIndex}-${partIdx}`}>{`${data.x} : ${
                  data.y
                } = ${Math.floor(data.x / data.y)}`}</span>
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
            const formula = sanitizeMath(part.slice(2, -2));
            return (
              <BlockMath key={`b-${lineIndex}-${partIdx}`}>{formula}</BlockMath>
            );
          }

          // Если часть начинается и заканчивается $ → inline‑math
          if (part.startsWith('$') && part.endsWith('$')) {
            const formula = sanitizeMath(part.slice(1, -1));
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
              part.type === LongDivision)
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
  const typedTasks = tasks as unknown as Task[];
  const totalPages = Math.ceil(typedTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const currentTasks = typedTasks.slice(startIndex, endIndex);

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
                {task.condition.images?.length
                  ? task.condition.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={`/${img.local}`}
                        alt={img.local.split('/').pop() || 'Условие рисунок'}
                      />
                    ))
                  : null}
              </div>
            ) : task.condition?.html ? (
              <div className={styles.taskCondition}>
                {renderHTML(task.condition.html)}
                {task.condition.images?.length
                  ? task.condition.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={`/${img.local}`}
                        alt={img.local.split('/').pop() || 'Условие рисунок'}
                      />
                    ))
                  : null}
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
                {Array.isArray(sol.blocks) && sol.blocks.length > 0
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
