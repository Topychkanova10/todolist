let addMessage = document.querySelector('.message') //Находим элемент для ввода новой задачи
let addButton = document.querySelector('.add') //Находим кнопку для добавления задачи
let todo = document.querySelector('.todo') //Находим СПИСОК задач
let todoList = [] //создаем массив где будем хранить все задачи

// Если в localStorage есть данные, то их нужно добавить в массив
if (localStorage.getItem('todo')) {
    todoList = JSON.parse(localStorage.getItem('todo'))//преобразуем строку в массив
    displayMessages() //Отображаем задачи
}

// При клике на кнопку "Добавить" создаем новую задачу
addButton.addEventListener('click', () => {
    if (!addMessage.value) return //Если в поле ввода нет текста, то выходим из функции
    // Формируем обьект новой задачи
    let newTodo = {
        todo: addMessage.value, // теккст задачи
        checked: false, // флаг выполнено изначально false
        important: false // флаг важности
    }

    todoList.push(newTodo) //Добавляем задачу в массив
    localStorage.setItem('todo', JSON.stringify(todoList)) //Сохраняем массив в localStorage
    displayMessages() //Отображаем задачи
    addMessage.value = '' //Очищаем поле ввода
})
 
// функция для удаления задачи
function delTask() {
    // находим все кнопки с классом "delete"
    const deleteButtons = document.querySelectorAll('.delete')
    // пробегаемся по всем кнопкам
    deleteButtons.forEach((btn) => {
        // вешаем обработчик клика на каждую кнопку 
        btn.addEventListener('click', (event) => {
            // полкчаем индекс задачи из data-атрибута
            const index = event.target.dataset.index
            // удаляем задачу из массива по индексу
            todoList.splice(index, 1) //Удаляем задачу из массива
            localStorage.setItem('todo', JSON.stringify(todoList)) //Сохраняем массив в localStorage
            displayMessages() //Отображаем задачи
        })
    })
}

// функция для переключения флага важности задачи
function addImportant() {
    // находим все кнопки с классом "important"
    const importantButtons = document.querySelectorAll('.important-btn')
    // пробегаемся по всем кнопкам
    importantButtons.forEach((btn) => {
        // вешаем обработчик клика на каждую кнопку 
        btn.addEventListener('click', (event) => {
        // полкчаем индекс задачи из data-атрибута
        const index = event.target.dataset.index
        // меняем флаг важности задачи
        todoList[index].important = !todoList[index].important
        localStorage.setItem('todo', JSON.stringify(todoList)) //Сохраняем массив в localStorage
        displayMessages() //Отображаем задачи
    })
})
}

// функция для отображения всех хадач
function displayMessages() {
    // если массив задач пуст, показываем сообщение "задач нет"
    if (!todoList.length) {
        todo.innerHTML = "Задач нет!"
        return
    }
    // строка в которую соберем html со всеми задачами
    let displayMessage = ''
    // перебираем все обьекты задач из массива todolist
    todoList.forEach((item, i) => {
        // формируем html-разметку для каждой задачи
        displayMessage += `
        <li>
            <input type="checkbox" id="item_${i}" ${item.checked ? 'checked' : ''}>

            <label for="item_${i}" class="${item.important ? 'important' : ''}">
                ${item.todo}
            </label>

            <div>
                <img class="important-btn" src="./icons/icon.png" alt="important">
                <img class="delete" data-index="${i}" src="./icons/icon.png" alt="delete">
            </div>
        </li>
        `
    })
    // записываем весь собранный html в элемент с id="todo"
    todo.innerHTML = displayMessage
    // включаем обработчики удаления для вновь созданных кнопок
    delTask()
    // включаем обработчики переключения важности
    addImportant()
}

