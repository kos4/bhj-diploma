/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) {
      throw 'Элемент не передан.';
    }

    this.element = element;
    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const html = {
      newIncome: this.element.querySelector('.create-income-button'),
      newExpense: this.element.querySelector('.create-expense-button'),
    };

    for(let property in html) {
      html[property].addEventListener('click', e => {
        e.preventDefault();
        const modal = new Modal(App.getModal(property).element);
        modal.open();
      });
    }
  }
}
