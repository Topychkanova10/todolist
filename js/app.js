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

