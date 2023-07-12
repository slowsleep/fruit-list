const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления
const minWeightInput = document.querySelector('.minweight__input'); // поле с минимальным весом
const maxWeightInput = document.querySelector('.maxweight__input'); // поле с максимальным весом


// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);


/*** ОТОБРАЖЕНИЕ ***/

let colors = new Map();
colors.set('фиолетовый', 'violet');
colors.set('зеленый', 'green');
colors.set('розово-красный', 'carmazin');
colors.set('желтый', 'yellow');
colors.set('светло-коричневый', 'lightbrown');

// отрисовка карточек
const display = () => {
  fruitsList.innerHTML = '';

  for (let i = 0; i < fruits.length; i++) {
    let fruit = document.createElement('li');
    fruit.className = 'fruit__item ';
    fruit.className += 'fruit_' + colors.get(fruits[i].color);
    fruit.innerHTML = `
      <div class="fruit__info">
        <div>index: ${i}</div>
        <div>kind: ${fruits[i].kind}</div>
        <div>color: ${fruits[i].color}</div>
        <div>weight (кг): ${fruits[i].weight}</div>
      </div>
    `;
    fruitsList.appendChild(fruit);
  }
};

// первая отрисовка карточек
window.onload = function(){
  display();
};

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let cloneFruits = [ ...fruits ];
  let result = [];

  while (fruits.length > 0) {
    let randIndex = getRandomInt(0, fruits.length - 1);
    let randElem = randIndex == 0 ? fruits.splice(0, 1) : fruits.splice(randIndex, 1);
    result.push(randElem[0]);
  }

  if (JSON.stringify(cloneFruits) == JSON.stringify(result)) {
    alert('Список не перемешался. Попробуйте еще раз.');
  }

  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});


/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  // 0 - минимальный вес; 1000 - максимальный вес
  let minVal = minWeightInput.value ? Number(minWeightInput.value) : 0;
  let maxVal = maxWeightInput.value ? Number(maxWeightInput.value) : 1000;

  let newFruits = fruits.filter((item) => {
    return item.weight >= minVal && item.weight <= maxVal
  });

  fruits = newFruits;
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  const priority = ['розово-красный', 'светло-коричневый', 'желтый', 'зеленый', 'фиолетовый'];
  const priority1 = priority.indexOf(a.color);
  const priority2 = priority.indexOf(b.color);

  return priority1 > priority2;
};


// Функции для быстрой сортировки
// функция обмена элементов
function swap(items, firstIndex, secondIndex){
  const temp = items[firstIndex];
  items[firstIndex] = items[secondIndex];
  items[secondIndex] = temp;
}
// функция разделитель
function partition(items, left, right, comparation) {
  let pivot = items[Math.floor((right + left) / 2)]
  let i = left;
  let j = right;
  while (i <= j) {
      while (comparation(pivot, items[i])) {
        i++;
      }
      while (comparation(items[j], pivot)) {
        j--;
      }
      if (i <= j) {
          swap(items, i, j);
          i++;
          j--;
      }
  }
  return i;
}

const sortAPI = {
  bubbleSort(arr, comparation) {
    const n = arr.length;
    // внешняя итерация по элементам
    for (let i = 0; i < n-1; i++) {
        // внутренняя итерация для перестановки элемента в конец массива
        for (let j = 0; j < n-1-i; j++) {
            // сравниваем элементы
            if (comparation(arr[j], arr[j+1])) {
                // делаем обмен элементов
                let temp = arr[j+1];
                arr[j+1] = arr[j];
                arr[j] = temp;
            }
        }
    }
  },

  quickSort(arr, left, right, comparation) {
    var index;
    if (arr.length > 1) {
        left = typeof left != "number" ? 0 : left;
        right = typeof right != "number" ? arr.length - 1 : right;
        index = partition(arr, left, right, comparation);
        if (left < index - 1) {
          sortAPI.quickSort(arr, left, index - 1, comparation);
        }
        if (index < right) {
          sortAPI.quickSort(arr, index, right, comparation);
        }
    }
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    if (sort == this.bubbleSort) {
      sort(arr, comparation);
    } else {
      sort(arr, 0, arr.length - 1, comparation)
    }
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  sortKind = sortKind != 'quickSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'sorting...';
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  sortTimeLabel.textContent = sortTime;
});


/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {

  let kindVal = kindInput.value;
  let colorVal = colorInput.value;
  let weightVal = weightInput.value;

  if (!kindVal) {
    alert('Заполните значение kind');
    return;
  } else if (!colorVal) {
    alert('Заполните значение color');
    return;
  } else if (!weightVal) {
    alert('Заполните значение weight');
    return;
  }

  let newFruit = {
    kind: kindInput.value,
    color: colorInput.value,
    weight: weightInput.value
  };

  fruits.push(newFruit);

  display();
});
