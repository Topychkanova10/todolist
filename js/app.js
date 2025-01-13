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
function setTask() {
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
}

addButton.addEventListener('click', () => setTask()) //Вешаем обработчик на кнопку

addMessage.addEventListener('keyup', (event) => {
    if (event.key ==="Enter") {
        event.preventDefault()
        setTask() //Если нажата клавиша Enter, то вызываем функцию добавления задачи
    }
})
 
// функция для удаления задачи
function delTask() {
    // находим все кнопки с классом "delete"
    const deleteButtons = document.querySelectorAll('.delete')
    // пробегаемся по всем кнопкам
    deleteButtons.forEach((btn) => {
        // вешаем обработчик клика на каждую кнопку 
            const newBtn = btn.cloneNode(true) //клонируем кнопку
            btn.parentNode.replaceChild(newBtn, btn) //заменяем кнопку на клонированную
            newBtn.addEventListener('click', (event) => {
            // полкчаем индекс задачи из data-атрибута
            const index = event.target.dataset.index
            if (todoList[index] !== undefined) {
                // удаляем задачу из массива по индексу
                todoList.splice(index, 1) //Удаляем задачу из массива
                localStorage.setItem('todo', JSON.stringify(todoList)) //Сохраняем массив в localStorage
                displayMessages() //Отображаем задачи
            }
        })
    })
}

// функция для переключения флага важности задачи
function addImportant() {
    // находим все кнопки с классом "important"
    const importantButtons = document.querySelectorAll('.important-btn')
    importantButtons.forEach((btn) => {
        const newBtn = btn.cloneNode(true) //клонируем кнопку
        btn.parentNode.replaceChild(newBtn, btn) //заменяем кнопку на клонированную
        // вешаем обработчик клика на каждую кнопку 
        newBtn.addEventListener('click', (event) => {
            // полкчаем индекс задачи из data-атрибута
            const index = event.target.dataset.index
            // меняем флаг важности задачи
            if (todoList[index] !== undefined) {
                todoList[index].important = !todoList[index].important
                localStorage.setItem('todo', JSON.stringify(todoList)) //Сохраняем массив в localStorage
                displayMessages() //Отображаем задачи
            }
        })
    })
}

function editTask() {
    const editButtons = document.querySelectorAll('.edit')//находим все кнопки редактирования 
    editButtons.forEach((btn) => {
        const newBtn = btn.cloneNode(true) //клонируем кнопку
        btn.parentNode.replaceChild(newBtn, btn) //заменяем кнопку на клонированную
        newBtn.addEventListener('click', (event) => {
            const index = event.target.dataset.index//получаем индекс текущей задачи из data-артибута
            const taskElement = event.target.closest('li')//находим родительский элемент li для текущей задачи
            const label = taskElement.querySelector('label')//находим элемент label внутри текущей задачи
            if(taskElement.querySelector('.edit-input')) return
            const input = document.createElement('input')//создаем новый элемент input
            input.type = 'text'//устанавливаем тип элемента input в "text"
            input.value = todoList[index].todo
            input.className = 'edit-input'
            
            // временно скрываем label и показываем input
            taskElement.insertBefore(input, label)
            label.style.display = 'none'
            input.focus();//устанавливаем фокус на элементе input
            const handleSave = () => {
                const newText = input.value.trim();
                if (newText && label) {
                    todoList[index].todo = newText
                    label.textContent = newText
                    localStorage.setItem('todo',  JSON.stringify(todoList))
                } 

                if (label && label.parentNode) label.style.display = ''
                if (input.parentNode) input.remove()
            }
            // обработчик для сохранения изменений  при потере фокуса
            input.addEventListener('blur', () => setTimeout(handleSave, 100))
            // Обработчик для сохранения изменений при нажатии Enter
            input.addEventListener('keyup', (event) => {
                if (event.key === 'Enter') {
                    handleSave()
                }
            })
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
    // перебираем все обьекты задач из массива todoList
    todoList.forEach((item, i) => {
        // формируем html-разметку для каждой задачи
        displayMessage += `
        <li>
            <input type="checkbox" id="item_${i}" ${item.checked ? 'checked' : ''}>

            <label for="item_${i}" class="${item.important ? 'important' : ''}">
                ${item.todo}
            </label>

            <div class="tools">
                <img class="edit" data-index="${i}" src="./icons/edit.png" alt="edit">
                <img class="delete" data-index="${i}" src="./icons/delete.png" alt="delete">
                <img class="important-btn" data-index="${i}" src="./icons/important.png" alt="important">
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
    editTask()
}

