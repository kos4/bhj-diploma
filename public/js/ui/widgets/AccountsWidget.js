/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) {
      throw 'Элемент не передан.';
    }

    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const elementBtnCreateAcc = document.querySelector('.create-account');
    elementBtnCreateAcc.addEventListener('click', e => {
      e.preventDefault();
      const modal = new Modal(document.getElementById('modal-new-account'));
      modal.open();
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const user = User.current;
    if (user) {
      Account.list(user, (err, response) => {
        if (err) {
          console.log(`Ошибка ${err.code}. ${err.message}`);
        } else {
          if (response.success) {
            this.clear();
            response.data.forEach(item => {
              this.renderItem(item);
            });
          } else {
            console.log(`Ошибка: ${response.error}`);
          }
        }
      });

    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const elementsAcc = this.element.querySelectorAll('.account');
    elementsAcc.forEach(item => {
      item.remove();
    });
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    const elementOldActive = this.element.querySelectorAll('.active.account');
    elementOldActive.forEach(item => {
      item.classList.toggle('active');
    });
    element.classList.toggle('active');
    App.showPage( 'transactions', { account_id: element.dataset.id });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    const elementAcc = document.createElement('li');
    elementAcc.className = 'account';
    elementAcc.dataset.id = item.id;
    const elementLink = document.createElement('a');
    elementLink.href = '#';
    const elementName = document.createElement('span');
    elementName.innerText = item.name;
    const nodeText = document.createTextNode(' / ');
    const elementSum = document.createElement('span');
    elementSum.innerText = item.sum + ' ₽';
    elementLink.append(elementName);
    elementLink.append(nodeText)
    elementLink.append(elementSum);
    elementAcc.append(elementLink);

    return elementAcc;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    const elementAcc = this.getAccountHTML(data);
    elementAcc.addEventListener('click', e => {
      this.onSelectAccount(elementAcc);
    });
    this.element.append(elementAcc);
  }
}
