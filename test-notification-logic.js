// Тестовый скрипт для проверки логики уведомлений
const NOTIFICATION_CRITERIA = {
  math: {
    minGrade: 4,
    difficultyLevels: {
      1: { requiredRecords: 3, operators: ['+', '-', '*', '/'] },
      2: { requiredRecords: 2, operators: ['+', '-', '*', '/'] },
      3: { requiredRecords: 1, operators: ['+', '-', '*', '/'] },
    },
  },
  english: {
    minGrade: 1,
    minRecords: 1,
  },
};

// Тестовые данные пользователя
const testUserData = {
  userId: 'test-user',
  totalRecords: 2,
  byDifficulty: {
    1: { '+': 2, '-': 0, '*': 0, '/': 0 },
    2: { '+': 0, '-': 0, '*': 0, '/': 0 },
    3: { '+': 0, '-': 0, '*': 0, '/': 0 },
  },
};

console.log('Тестирование логики уведомлений для математики:');
console.log('Данные пользователя:', testUserData);

// Проверяем выполнение для каждого уровня сложности
const level1Complete =
  NOTIFICATION_CRITERIA.math.difficultyLevels[1].operators.every(
    op =>
      testUserData.byDifficulty[1][op] >=
      NOTIFICATION_CRITERIA.math.difficultyLevels[1].requiredRecords
  );

const level2Complete =
  NOTIFICATION_CRITERIA.math.difficultyLevels[2].operators.every(
    op =>
      testUserData.byDifficulty[2][op] >=
      NOTIFICATION_CRITERIA.math.difficultyLevels[2].requiredRecords
  );

const level3Complete =
  NOTIFICATION_CRITERIA.math.difficultyLevels[3].operators.every(
    op =>
      testUserData.byDifficulty[3][op] >=
      NOTIFICATION_CRITERIA.math.difficultyLevels[3].requiredRecords
  );

console.log('Результаты проверки уровней:');
console.log('- Уровень 1:', level1Complete);
console.log('- Уровень 2:', level2Complete);
console.log('- Уровень 3:', level3Complete);

// Основные критерии
const meetsMainCriteria = level1Complete || level2Complete || level3Complete;
console.log('Выполняет основные критерии:', meetsMainCriteria);

// Альтернативные критерии
const hasAnySufficientOperator = Object.values(testUserData.byDifficulty).some(
  level => Object.values(level).some(count => count >= 1)
);
console.log('Выполняет альтернативные критерии:', hasAnySufficientOperator);

// Итоговое решение
const shouldNotify = !(meetsMainCriteria || hasAnySufficientOperator);
console.log('Должен получить уведомление:', shouldNotify);

console.log('\nДетали по операторам:');
NOTIFICATION_CRITERIA.math.difficultyLevels[1].operators.forEach(op => {
  const actual = testUserData.byDifficulty[1][op];
  const required =
    NOTIFICATION_CRITERIA.math.difficultyLevels[1].requiredRecords;
  console.log(
    `- ${op}: ${actual}/${required} (${actual >= required ? '✓' : '✗'})`
  );
});
