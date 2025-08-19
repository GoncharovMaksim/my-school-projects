const getOptionsList = async () => {
  try {
    const params = new URLSearchParams('optionsList').toString();
    const response = await fetch(`/api/mathQuestions?${params}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Ошибка ответа сервера: ${response.status} — ${errorText}`
      );
    }

    const data = await response.json();
    console.log('Загружен список тем:', data);
    return data;
  } catch (error) {
    console.error('Ошибка при загрузке списка тем:', error);
  }
};

export default getOptionsList;
