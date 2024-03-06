/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      throw 'Элемент не передан.';
    }

    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const htmlRemoveAccount = this.element.querySelector('.remove-account');
    htmlRemoveAccount.addEventListener('click', e => {
      e.preventDefault();
      this.removeAccount();
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      if (confirm('Вы действительно хотите удалить счёт?')) {
        Account.remove({id: this.lastOptions.account_id}, (err, response) => {
          if (err) {
            console.log(`Ошибка ${err.code}. ${err.message}`);
          } else {
            if (response.success) {
              App.updateWidgets();
              App.updateForms();
              this.clear();
            } else {
              console.log(`Ошибка: ${response.error}`);
            }
          }
        });
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove({id}, (err, response) => {
        if (err) {
          console.log(`Ошибка ${err.code}. ${err.message}`);
        } else {
          if (response.success) {
            App.update();
          } else {
            console.log(`Ошибка: ${response.error}`);
          }
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (options) {
      this.lastOptions = options;

      Account.get(options.account_id, (err, response) => {
        if (err) {
          console.log(`Ошибка ${err.code}. ${err.message}`);
        } else {
          if (response.success) {
            this.renderTitle(response.data.name);
          } else {
            console.log(`Ошибка: ${response.error}`);
          }
        }
      });

      Transaction.list(options, (err, response) => {
        if (err) {
          console.log(`Ошибка ${err.code}. ${err.message}`);
        } else {
          if (response.success) {
            this.renderTransactions(response.data);
          } else {
            console.log(`Ошибка: ${response.error}`);
          }
        }
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    delete this.lastOptions;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const elementTitle = this.element.querySelector('.content-title');
    elementTitle.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    date = new Date(date);
    const month = [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ];
    return `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()} г. в ${date.getHours()}:${date.getMinutes()}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const html = {
      transaction: document.createElement('div'),
      transactionDetails: document.createElement('div'),
      transactionIcon: document.createElement('div'),
      transactionIconFa: document.createElement('span'),
      transactionInfo: document.createElement('div'),
      transactionTitle: document.createElement('h4'),
      transactionDate: document.createElement('div'),
      colMdThree: document.createElement('div'),
      transactionSumm: document.createElement('div'),
      currency: document.createElement('span'),
      transactionControls: document.createElement('div'),
      transactionRemove: document.createElement('button'),
      transactionRemoveFa: document.createElement('i'),
    };
    html.transaction.className = `transaction transaction_${item.type} row`;
    html.transactionDetails.className = 'col-md-7 transaction__details';
    html.transactionIcon.className = 'transaction__icon';
    html.transactionIconFa.className = 'fa fa-money fa-2x';
    html.transactionInfo.className = 'transaction__info';
    html.transactionTitle.className = 'transaction__title';
    html.transactionTitle.textContent = item.name;
    html.transactionDate.className = 'transaction__date';
    html.transactionDate.textContent = this.formatDate(item.created_at);
    html.colMdThree.className = 'col-md-3';
    html.transactionSumm.className = 'transaction__summ';
    html.transactionSumm.textContent = `${item.sum} `;
    html.currency.className = 'currency';
    html.currency.textContent = '₽';
    html.transactionControls.className = 'col-md-2 transaction__controls';
    html.transactionRemove.className = 'btn btn-danger transaction__remove';
    html.transactionRemove.dataset.id = item.id;
    html.transactionRemoveFa.className = 'fa fa-trash';
    html.transactionRemove.append(html.transactionRemoveFa);
    html.transactionRemove.addEventListener('click', e => {
      e.preventDefault();
      this.removeTransaction(item.id);
    });
    html.transactionControls.append(html.transactionRemove);
    html.transactionSumm.append(html.currency);
    html.colMdThree.append(html.transactionSumm);
    html.transactionInfo.append(html.transactionTitle);
    html.transactionInfo.append(html.transactionDate);
    html.transactionIcon.append(html.transactionIconFa);
    html.transactionDetails.append(html.transactionIcon);
    html.transactionDetails.append(html.transactionInfo);
    html.transaction.append(html.transactionDetails);
    html.transaction.append(html.colMdThree);
    html.transaction.append(html.transactionControls);

    return html.transaction;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const html = {
      content: this.element.querySelector('.content'),
    };
    html.content.textContent = '';
    data.forEach(item => {
      html.content.append(this.getTransactionHTML(item));
    });
  }
}