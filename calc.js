/**
 * Калькулятор стоимости услуг.
 * Считает цену по типу услуги, объёму и доп. опциям.
 * Цены заданы в конфиге — их легко менять без правки логики.
 */

// ——— Конфиг цен (удобно расширять: добавить тип услуги или опцию) ———
var PRICES = {
  // Цена за единицу: за м² (клининг) или за час (ремонт, фриланс)
  cleaning: { perUnit: 150, unitLabel: 'м²' },
  repair:    { perUnit: 800, unitLabel: 'час' },
  freelance: { perUnit: 1200, unitLabel: 'час' }
};

// Доп. коэффициенты и фикс. суммы
var URGENT_PERCENT = 20;   // надбавка за срочность, %
var VISIT_FEE = 500;      // доп. плата за выезд (для клининга/ремонта логично; для фриланса можно 0 или убрать опцию)

// ——— Ссылки на элементы страницы (получаем один раз при загрузке) ———
var formEl = document.getElementById('calc-form');
var serviceTypeGroupEl = document.getElementById('service-type-group');
var volumeEl = document.getElementById('volume');
var volumeLabelEl = document.getElementById('volume-label');
var extraOptionEl = document.getElementById('extra-option');
var resultBlock = document.getElementById('result');
var resultPriceEl = document.getElementById('result-price');

/** Возвращает значение выбранного типа услуги (кнопки-radio). */
function getServiceType() {
  var checked = serviceTypeGroupEl.querySelector('input:checked');
  return checked ? checked.value : 'cleaning';
}

/**
 * Обновляет подпись поля «Объём» в зависимости от типа услуги:
 * клининг — «Площадь, м²», ремонт/фриланс — «Часы».
 */
function updateVolumeLabel() {
  var type = getServiceType();
  volumeLabelEl.textContent = type === 'cleaning' ? 'Площадь, м²' : 'Часы';
}

/** Максимально допустимый объём (защита от нереалистичных значений). */
var MAX_VOLUME = 100000;

/**
 * Проверка крайних случаев ввода. Возвращает строку ошибки или null, если всё ок.
 * @returns {string|null}
 */
function validateInput() {
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
  var type = getServiceType();
  var volume = Number(volumeEl.value) || 0;
  var extra = extraOptionEl.value;

  var cfg = PRICES[type];
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

// ——— При смене типа услуги (кнопки) меняем подпись поля «Объём» ———
serviceTypeGroupEl.addEventListener('change', updateVolumeLabel);

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

// Подставляем подпись при первой загрузке страницы
updateVolumeLabel();
