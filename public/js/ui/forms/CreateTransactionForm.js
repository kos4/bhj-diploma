/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);

    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const user = User.current;
    if (user) {
      Account.list(user, (err, response) => {
        if (err) {
          console.log(`Ошибка ${err.code}. ${err.message}`);
        } else {
          if (response.success) {
            const htmlList = this.element.querySelector('.accounts-select');
            htmlList.innerText = '';
            response.data.forEach(item => {
              const htmlElement = document.createElement('option');
              htmlElement.value = item.id;
              htmlElement.textContent = item.name;
              htmlList.append(htmlElement);
            });
          } else {
            console.log(`Ошибка: ${response.error}`);
          }
        }
      });
    }
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (err) {
        console.log(`Ошибка ${err.code}. ${err.message}`);
      } else {
        if (response.success) {
          this.closeForm();
          App.update();
        } else {
          console.log(`Ошибка: ${response.error}`);
        }
      }
    });
  }
}