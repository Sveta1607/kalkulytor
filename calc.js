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
var serviceTypeEl = document.getElementById('service-type');
var volumeEl = document.getElementById('volume');
var volumeLabelEl = document.getElementById('volume-label');
var urgentEl = document.getElementById('urgent');
var visitEl = document.getElementById('visit');
var resultBlock = document.getElementById('result');
var resultPriceEl = document.getElementById('result-price');

/**
 * Обновляет подпись поля «Объём» в зависимости от типа услуги:
 * клининг — «Площадь, м²», ремонт/фриланс — «Часы».
 */
function updateVolumeLabel() {
  var type = serviceTypeEl.value;
  var cfg = PRICES[type];
  volumeLabelEl.textContent = type === 'cleaning' ? 'Площадь, м²' : 'Часы';
}

/**
 * Считает итоговую цену по выбранным параметрам.
 * @returns {number} сумма в рублях
 */
function calculate() {
  var type = serviceTypeEl.value;
  var volume = Number(volumeEl.value) || 0;
  var isUrgent = urgentEl.checked;
  var isVisit = visitEl.checked;

  var cfg = PRICES[type];
  if (!cfg || volume <= 0) return 0;

  // Базовая сумма: цена за единицу × объём
  var total = cfg.perUnit * volume;

  // Надбавка за срочность (процент от текущей суммы)
  if (isUrgent) {
    total = total * (1 + URGENT_PERCENT / 100);
  }

  // Фиксированная доплата за выезд
  if (isVisit) {
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
  resultBlock.hidden = false;
}

// ——— При смене типа услуги меняем подпись поля «Объём» ———
serviceTypeEl.addEventListener('change', updateVolumeLabel);

// ——— При отправке формы: считаем цену и показываем результат ———
formEl.addEventListener('submit', function (e) {
  e.preventDefault();
  var price = calculate();
  showResult(price);
});

// Подставляем подпись при первой загрузке страницы
updateVolumeLabel();
