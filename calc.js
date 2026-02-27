/**
 * Калькулятор стоимости услуг.
 * Считает цену по типу услуги, объёму и доп. опциям.
 * Цены заданы в конфиге — их легко менять без правки логики.
 */

// ——— Список услуг по категориям: категория → массив услуг ———
// Услуга: { id, name, perUnit, unitLabel } — id для value в select, perUnit — цена за единицу
var SERVICES = [
  {
    name: 'IT-сфера',
    items: [
      { id: 'admin', name: 'Администрирование', perUnit: 1200, unitLabel: 'час' },
      { id: 'data-analysis', name: 'Анализ данных', perUnit: 1200, unitLabel: 'час' },
      { id: 'webmaster', name: 'Вебмастер', perUnit: 1200, unitLabel: 'час' },
      { id: 'layout-design', name: 'Верстка и дизайн', perUnit: 1200, unitLabel: 'час' },
      { id: 'computer-master', name: 'Компьютерный мастер', perUnit: 800, unitLabel: 'час' },
      { id: 'data-processing', name: 'Обработка данных', perUnit: 1000, unitLabel: 'час' },
      { id: 'programmer', name: 'Программист', perUnit: 1500, unitLabel: 'час' },
      { id: 'tech-support', name: 'Техническая поддержка', perUnit: 800, unitLabel: 'час' }
    ]
  },
  {
    name: 'Авто',
    items: [
      { id: 'carwash', name: 'Автомойка', perUnit: 500, unitLabel: 'усл.' },
      { id: 'autoservice', name: 'Автосервис', perUnit: 1200, unitLabel: 'час' },
      { id: 'evacuation', name: 'Автоэвакуация и буксировка', perUnit: 2000, unitLabel: 'усл.' },
      { id: 'driver', name: 'Водитель', perUnit: 600, unitLabel: 'час' },
      { id: 'cargo-transport', name: 'Перевозка грузов', perUnit: 800, unitLabel: 'час' },
      { id: 'passenger-transport', name: 'Перевозка пассажиров', perUnit: 600, unitLabel: 'час' }
    ]
  },
  {
    name: 'Аренда',
    items: [
      { id: 'rent-flat', name: 'Аренда квартир', perUnit: 1500, unitLabel: 'сут.' },
      { id: 'rent-car', name: 'Аренда машин', perUnit: 3000, unitLabel: 'сут.' },
      { id: 'licenses', name: 'Предоставление лицензий', perUnit: 2000, unitLabel: 'мес.' },
      { id: 'rental', name: 'Прокат', perUnit: 500, unitLabel: 'час' },
      { id: 'accommodation', name: 'Услуга по временному проживанию', perUnit: 2000, unitLabel: 'сут.' },
      { id: 'storage', name: 'Услуга по хранению', perUnit: 200, unitLabel: 'м²/мес.' }
    ]
  },
  {
    name: 'Дом',
    items: [
      { id: 'household', name: 'Бытовые услуги', perUnit: 400, unitLabel: 'час' },
      { id: 'housekeeping', name: 'Ведение хозяйства', perUnit: 500, unitLabel: 'час' },
      { id: 'governess', name: 'Гувернантка', perUnit: 800, unitLabel: 'час' },
      { id: 'delivery', name: 'Доставка', perUnit: 300, unitLabel: 'усл.' },
      { id: 'nanny', name: 'Няня', perUnit: 600, unitLabel: 'час' },
      { id: 'cook', name: 'Повар', perUnit: 1000, unitLabel: 'час' },
      { id: 'caregiver', name: 'Сиделка', perUnit: 500, unitLabel: 'час' },
      { id: 'social-help', name: 'Социальная помощь', perUnit: 400, unitLabel: 'час' },
      { id: 'watchman', name: 'Сторож', perUnit: 400, unitLabel: 'час' },
      { id: 'cleaning', name: 'Уборка и клининг', perUnit: 150, unitLabel: 'м²' },
      { id: 'dry-clean', name: 'Химчистка', perUnit: 200, unitLabel: 'м²' }
    ]
  },
  {
    name: 'Животные',
    items: [
      { id: 'animal-vaccine', name: 'Вакцинация животных', perUnit: 500, unitLabel: 'усл.' },
      { id: 'grooming', name: 'Груминг', perUnit: 1500, unitLabel: 'усл.' },
      { id: 'trainer', name: 'Дрессировщик', perUnit: 800, unitLabel: 'час' },
      { id: 'cynology', name: 'Кинология', perUnit: 800, unitLabel: 'час' },
      { id: 'animal-boarding', name: 'Передержка животных', perUnit: 500, unitLabel: 'сут.' },
      { id: 'animal-care', name: 'Уход за животными', perUnit: 400, unitLabel: 'час' }
    ]
  },
  {
    name: 'Здоровье',
    items: [
      { id: 'dietitian', name: 'Диетолог', perUnit: 1500, unitLabel: 'час' },
      { id: 'health-consulting', name: 'Консультирование', perUnit: 1200, unitLabel: 'час' },
      { id: 'speech-therapist', name: 'Логопед', perUnit: 1000, unitLabel: 'час' },
      { id: 'masseur', name: 'Массажист', perUnit: 1500, unitLabel: 'час' },
      { id: 'psychologist', name: 'Психолог', perUnit: 2000, unitLabel: 'час' },
      { id: 'health-coach', name: 'Тренер, инструктор', perUnit: 1200, unitLabel: 'час' }
    ]
  },
  {
    name: 'Информационные услуги',
    items: [
      { id: 'research', name: 'Исследования', perUnit: 1500, unitLabel: 'час' },
      { id: 'marketing', name: 'Маркетинг, реклама', perUnit: 1200, unitLabel: 'час' },
      { id: 'ritual', name: 'Обрядовые услуги', perUnit: 5000, unitLabel: 'усл.' },
      { id: 'surveys', name: 'Опросы, сбор мнений', perUnit: 800, unitLabel: 'час' },
      { id: 'translator', name: 'Переводчик', perUnit: 1000, unitLabel: 'час' }
    ]
  },
  {
    name: 'Красота',
    items: [
      { id: 'beauty-consulting', name: 'Консультирование', perUnit: 800, unitLabel: 'час' },
      { id: 'cosmetologist', name: 'Косметолог', perUnit: 1500, unitLabel: 'усл.' },
      { id: 'manicure', name: 'Маникюр, педикюр', perUnit: 800, unitLabel: 'усл.' },
      { id: 'model', name: 'Модель', perUnit: 3000, unitLabel: 'час' },
      { id: 'hairdresser', name: 'Парикмахер', perUnit: 800, unitLabel: 'усл.' },
      { id: 'stylist', name: 'Стилист', perUnit: 1200, unitLabel: 'час' },
      { id: 'tattoo', name: 'Тату и пирсинг', perUnit: 2000, unitLabel: 'час' },
      { id: 'epilation', name: 'Эпиляция', perUnit: 1000, unitLabel: 'усл.' }
    ]
  },
  {
    name: 'Обучение',
    items: [
      { id: 'tutor', name: 'Репетитор', perUnit: 1000, unitLabel: 'час' },
      { id: 'teacher', name: 'Учитель', perUnit: 800, unitLabel: 'час' }
    ]
  },
  {
    name: 'Общественное питание',
    items: [
      { id: 'confectioner', name: 'Кондитер', perUnit: 1000, unitLabel: 'час' },
      { id: 'catering', name: 'Обслуживание', perUnit: 500, unitLabel: 'час' },
      { id: 'cook-catering', name: 'Повар', perUnit: 1000, unitLabel: 'час' }
    ]
  },
  {
    name: 'Одежда',
    items: [
      { id: 'fashion-designer', name: 'Модельер, дизайнер', perUnit: 1500, unitLabel: 'час' },
      { id: 'tailoring', name: 'Пошив', perUnit: 800, unitLabel: 'усл.' },
      { id: 'sewing', name: 'Ткани, кройка, шитьё', perUnit: 600, unitLabel: 'час' }
    ]
  },
  {
    name: 'Природа',
    items: [
      { id: 'landscaping', name: 'Благоустройство территории', perUnit: 500, unitLabel: 'м²' },
      { id: 'animal-husbandry', name: 'Животноводство', perUnit: 600, unitLabel: 'час' },
      { id: 'forest-hunting', name: 'Лес, охота, рыбалка', perUnit: 2000, unitLabel: 'усл.' },
      { id: 'waste-processing', name: 'Переработка отходов', perUnit: 300, unitLabel: 'т' },
      { id: 'scrap-metal', name: 'Приём или сдача лома', perUnit: 30, unitLabel: 'кг' },
      { id: 'agriculture', name: 'Сельхоз услуги', perUnit: 500, unitLabel: 'час' }
    ]
  },
  {
    name: 'Прочее',
    items: [
      { id: 'loader', name: 'Грузчик', perUnit: 400, unitLabel: 'час' },
      { id: 'copywriter', name: 'Копирайтер', perUnit: 800, unitLabel: 'час' },
      { id: 'porter', name: 'Носильщик', perUnit: 300, unitLabel: 'усл.' },
      { id: 'security', name: 'Обеспечение безопасности', perUnit: 600, unitLabel: 'час' },
      { id: 'writer', name: 'Писатель', perUnit: 1000, unitLabel: 'час' },
      { id: 'paid-toilets', name: 'Платные туалеты', perUnit: 50, unitLabel: 'усл.' },
      { id: 'entertainment', name: 'Развлечения', perUnit: 2000, unitLabel: 'час' }
    ]
  },
  {
    name: 'Развлечения',
    items: [
      { id: 'animator', name: 'Аниматор', perUnit: 1500, unitLabel: 'час' },
      { id: 'artist', name: 'Артист, певец, музыкант', perUnit: 3000, unitLabel: 'час' },
      { id: 'host', name: 'Ведущий, шоумен, тамада', perUnit: 5000, unitLabel: 'усл.' },
      { id: 'guide', name: 'Гид, экскурсовод', perUnit: 1500, unitLabel: 'час' }
    ]
  },
  {
    name: 'Ремонт',
    items: [
      { id: 'household-repair', name: 'Бытовой ремонт', perUnit: 800, unitLabel: 'час' },
      { id: 'design', name: 'Дизайн', perUnit: 1200, unitLabel: 'час' },
      { id: 'finishing', name: 'Отделка', perUnit: 600, unitLabel: 'м²' },
      { id: 'appliance-repair', name: 'Ремонт бытовой техники', perUnit: 800, unitLabel: 'час' },
      { id: 'apartment-repair', name: 'Ремонт квартир', perUnit: 1000, unitLabel: 'м²' },
      { id: 'restoration', name: 'Реставрация', perUnit: 1500, unitLabel: 'час' },
      { id: 'plumber', name: 'Сантехник', perUnit: 1000, unitLabel: 'час' },
      { id: 'construction', name: 'Строительство', perUnit: 800, unitLabel: 'м²' },
      { id: 'maintenance', name: 'Техобслуживание', perUnit: 600, unitLabel: 'час' },
      { id: 'electrician', name: 'Электрик', perUnit: 900, unitLabel: 'час' }
    ]
  },
  {
    name: 'Сделай сам',
    items: [
      { id: 'blacksmith', name: 'Кузнец', perUnit: 1500, unitLabel: 'час' },
      { id: 'metalwork', name: 'Металлообработка', perUnit: 800, unitLabel: 'час' },
      { id: 'engineering', name: 'Проектирование', perUnit: 1500, unitLabel: 'час' },
      { id: 'production', name: 'Производственные услуги', perUnit: 600, unitLabel: 'час' },
      { id: 'carpenter', name: 'Столяр, плотник', perUnit: 1000, unitLabel: 'час' },
      { id: 'assembly', name: 'Услуги по сборке', perUnit: 500, unitLabel: 'час' }
    ]
  },
  {
    name: 'Спорт',
    items: [
      { id: 'sport-consulting', name: 'Консультирование', perUnit: 1000, unitLabel: 'час' },
      { id: 'sport-masseur', name: 'Массажист', perUnit: 1500, unitLabel: 'час' },
      { id: 'sport-trainer', name: 'Тренер, инструктор', perUnit: 1200, unitLabel: 'час' }
    ]
  }
];

// Объект PRICES: id услуги → { perUnit, unitLabel } — нужен для быстрого поиска цены при расчёте
var PRICES = {};
// Заполняем PRICES из SERVICES: каждому id услуги сопоставляем цену и единицу измерения
SERVICES.forEach(function (cat) {
  cat.items.forEach(function (item) {
    PRICES[item.id] = { perUnit: item.perUnit, unitLabel: item.unitLabel };
  });
});

// Доп. коэффициенты и фикс. суммы
var URGENT_PERCENT = 20;   // надбавка за срочность, %
var VISIT_FEE = 500;      // доп. плата за выезд (для клининга/ремонта логично; для фриланса можно 0 или убрать опцию)

// ——— Ссылки на элементы страницы (получаем один раз при загрузке) ———
var formEl = document.getElementById('calc-form');
var categoriesGridEl = document.getElementById('categories-grid');
var categoriesWrapperEl = document.getElementById('categories-wrapper');
var servicesDropdownEl = document.getElementById('services-dropdown');
var servicesListEl = document.getElementById('services-list');
var selectedServiceDisplayEl = document.getElementById('selected-service-display');
var selectedServiceIdEl = document.getElementById('selected-service-id');
var volumeEl = document.getElementById('volume');
var volumeLabelEl = document.getElementById('volume-label');
var extraOptionEl = document.getElementById('extra-option');
var resultBlock = document.getElementById('result');
var resultPriceEl = document.getElementById('result-price');

// Услуги, для которых не применим выезд (удалённая работа)
var NO_VISIT_SERVICES = ['admin', 'data-analysis', 'webmaster', 'layout-design', 'data-processing', 'programmer', 'tech-support', 'copywriter', 'writer', 'research', 'marketing', 'surveys', 'translator'];

/** Возвращает id выбранной услуги из скрытого поля. */
function getServiceType() {
  var id = selectedServiceIdEl ? selectedServiceIdEl.value : '';
  return id || (SERVICES[0].items[0].id);
}

/** Возвращает конфиг выбранной услуги (perUnit, unitLabel). */
function getServiceConfig() {
  var id = getServiceType();
  return PRICES[id] || PRICES['cleaning'];
}

/**
 * Обновляет подпись поля «Объём» по unitLabel выбранной услуги
 * (например: «Площадь, м²», «Часы», «Количество, усл.» и т.д.).
 */
function updateVolumeLabel() {
  var cfg = getServiceConfig();
  if (!cfg || !volumeLabelEl) return;
  var label = cfg.unitLabel;
  if (label === 'м²') volumeLabelEl.textContent = 'Площадь, м²';
  else if (label === 'час') volumeLabelEl.textContent = 'Часы';
  else volumeLabelEl.textContent = 'Количество, ' + label;
}

/**
 * Для удалённых услуг (IT, копирайтинг и т.п.) опции «Выезд» и «Срочный + Выезд» недоступны.
 */
function updateExtraOptions() {
  var id = getServiceType();
  var optVisit = extraOptionEl.querySelector('option[value="visit"]');
  var optBoth = extraOptionEl.querySelector('option[value="both"]');
  var noVisit = NO_VISIT_SERVICES.indexOf(id) !== -1;

  if (noVisit) {
    optVisit.disabled = true;
    optBoth.disabled = true;
    if (extraOptionEl.value === 'visit' || extraOptionEl.value === 'both') {
      extraOptionEl.value = '';
    }
  } else {
    optVisit.disabled = false;
    optBoth.disabled = false;
  }
}

/**
 * Строит 17 кнопок категорий — одинакового размера в сетке.
 */
function buildCategoriesGrid() {
  if (!categoriesGridEl) return;
  categoriesGridEl.innerHTML = '';
  SERVICES.forEach(function (cat, catIndex) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cat-btn';
    btn.textContent = cat.name;
    btn.dataset.categoryIndex = catIndex;
    btn.addEventListener('click', function () { openServicesDropdown(btn, catIndex); });
    categoriesGridEl.appendChild(btn);
  });
}

/**
 * Открывает выпадающий список услуг под нажатой кнопкой категории.
 */
function openServicesDropdown(btn, catIndex) {
  var cat = SERVICES[catIndex];
  if (!cat || !servicesListEl || !servicesDropdownEl) return;

  // Снимаем активное состояние с остальных кнопок
  categoriesGridEl.querySelectorAll('.cat-btn').forEach(function (b) { b.classList.remove('is-active'); });
  btn.classList.add('is-active');

  // Заполняем список услуг
  servicesListEl.innerHTML = '';
  cat.items.forEach(function (item) {
    var li = document.createElement('li');
    li.textContent = item.name;
    li.dataset.serviceId = item.id;
    li.addEventListener('click', function () { selectService(item.id, item.name); });
    servicesListEl.appendChild(li);
  });

  // Позиционируем dropdown под кнопкой (относительно wrapper)
  var wrapperRect = categoriesWrapperEl.getBoundingClientRect();
  var btnRect = btn.getBoundingClientRect();
  servicesDropdownEl.style.left = (btnRect.left - wrapperRect.left) + 'px';
  servicesDropdownEl.style.top = (btnRect.bottom - wrapperRect.top + 4) + 'px';
  servicesDropdownEl.hidden = false;
}

/**
 * Выбор услуги: сохраняем id, обновляем отображение, закрываем dropdown.
 */
function selectService(serviceId, serviceName) {
  if (selectedServiceIdEl) selectedServiceIdEl.value = serviceId;
  if (selectedServiceDisplayEl) {
    selectedServiceDisplayEl.textContent = 'Выбрано: ' + serviceName;
    selectedServiceDisplayEl.classList.add('has-service');
    selectedServiceDisplayEl.hidden = false;
  }
  closeServicesDropdown();
  updateVolumeLabel();
  updateExtraOptions();
}

/** Закрывает выпадающий список услуг. */
function closeServicesDropdown() {
  if (servicesDropdownEl) servicesDropdownEl.hidden = true;
  categoriesGridEl.querySelectorAll('.cat-btn').forEach(function (b) { b.classList.remove('is-active'); });
}

/**
 * Обработка клика вне dropdown — закрытие списка.
 */
// Клик вне области категорий и выпадающего списка — закрываем dropdown
document.addEventListener('click', function (e) {
  if (!servicesDropdownEl || servicesDropdownEl.hidden) return;
  if (!categoriesWrapperEl || !categoriesWrapperEl.contains(e.target)) {
    closeServicesDropdown();
  }
});

/** Максимально допустимый объём (защита от нереалистичных значений). */
var MAX_VOLUME = 100000;

/**
 * Проверка крайних случаев ввода. Возвращает строку ошибки или null, если всё ок.
 * @returns {string|null}
 */
function validateInput() {
  // 0. Не выбрана услуга
  if (!selectedServiceIdEl || !selectedServiceIdEl.value) {
    return 'Выберите категорию и услугу.';
  }

  var raw = (volumeEl.value || '').trim();

  // 1. Пустое поле объёма
  if (raw === '') {
    return 'Введите объём (площадь или часы).';
  }

  var volume = Number(volumeEl.value);

  // 2. Введено не число (буквы, символы)
  if (Number.isNaN(volume)) {
    return 'Объём должен быть числом.';
  }

  // 3. Ноль
  if (volume === 0) {
    return 'Объём не может быть нулём.';
  }

  // 4. Отрицательное значение
  if (volume < 0) {
    return 'Объём не может быть отрицательным.';
  }

  // 5. Слишком большое число (переполнение / опечатка)
  if (volume > MAX_VOLUME) {
    return 'Укажите объём не больше ' + MAX_VOLUME + '.';
  }

  return null;
}

/**
 * Считает итоговую цену по выбранным параметрам.
 * @returns {number} сумма в рублях
 */
function calculate() {
  var volume = Number(volumeEl.value) || 0;
  var extra = extraOptionEl.value;

  var cfg = getServiceConfig();
  if (!cfg || volume <= 0) return 0;

  // Базовая сумма: цена за единицу × объём
  var total = cfg.perUnit * volume;

  // Надбавка за срочность (если выбрано в выпадающем списке)
  if (extra === 'urgent' || extra === 'both') {
    total = total * (1 + URGENT_PERCENT / 100);
  }

  // Фиксированная доплата за выезд (если выбрано в выпадающем списке)
  if (extra === 'visit' || extra === 'both') {
    total = total + VISIT_FEE;
  }

  return Math.round(total);
}

/**
 * Показывает блок с результатом и подставляет рассчитанную цену.
 * @param {number} price — итоговая цена в рублях
 */
function showResult(price) {
  resultPriceEl.textContent = price.toLocaleString('ru-RU') + ' ₽';
  resultPriceEl.classList.remove('is-error');
  resultBlock.hidden = false;
}

/**
 * Показывает в блоке результата сообщение об ошибке валидации.
 * @param {string} message — текст ошибки
 */
function showError(message) {
  resultPriceEl.textContent = message;
  resultPriceEl.classList.add('is-error');
  resultBlock.hidden = false;
}

// ——— При отправке формы: сначала проверка крайних случаев, затем расчёт ———
formEl.addEventListener('submit', function (e) {
  e.preventDefault();
  var error = validateInput();
  if (error) {
    showError(error);
    return;
  }
  var price = calculate();
  showResult(price);
});

// Строим 17 кнопок категорий при загрузке страницы
buildCategoriesGrid();
// Устанавливаем услугу по умолчанию (первая в первой категории)
if (selectedServiceIdEl && SERVICES[0].items[0]) {
  selectedServiceIdEl.value = SERVICES[0].items[0].id;
  if (selectedServiceDisplayEl) {
    selectedServiceDisplayEl.textContent = 'Выбрано: ' + SERVICES[0].items[0].name;
    selectedServiceDisplayEl.classList.add('has-service');
    selectedServiceDisplayEl.hidden = false;
  }
}
updateVolumeLabel();
updateExtraOptions();
