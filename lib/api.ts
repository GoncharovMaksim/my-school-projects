// src/api.js
const url = '/api/sheets/';


export async function apiGet() {
	const response = await fetch(url);
	const sheets = await response.json();
	return sheets;
}

export async function apiPost(sheetTitle, sheetContent, onAdd) {
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
			body: JSON.stringify({ sheetTitle, sheetContent }),
		});
		if (response.ok) {
			onAdd();
	
			
		}
		return response;
	} catch (err) {
		return console.log(err);
	}
}



export async function apiDelete(sheetId, onAdd) {
	const urlWithId = `${url}/${sheetId}`; // добавляем sheetId в URL

	try {
		const response = await fetch(urlWithId, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		});

		if (response.ok) {
			onAdd();
			
		} else {
			console.error(`Ошибка при удалении: ${response.statusText}`);
		}

		return response;
	} catch (err) {
		console.error('Ошибка при выполнении запроса:', err);
		return err;
	}
}






