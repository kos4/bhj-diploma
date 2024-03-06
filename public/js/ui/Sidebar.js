/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const elementButton = document.querySelector('.sidebar-toggle');
    elementButton.addEventListener('click', e => {
      e.preventDefault();
      const elementBody = document.querySelector('body');
      elementBody.classList.toggle('sidebar-open');
      elementBody.classList.toggle('sidebar-collapse');
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const elementMenu = document.querySelectorAll('.sidebar-menu .menu-item a');
    elementMenu.forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();

        try {
          const modalType = App.getModalType(item);

          if (modalType === 'logout') {
            User.logout((err, response) => {
              if (!err && response.success) {
                App.setState('init');
              }
            });
          } else {
            const modal = new Modal(App.getModal(modalType).element);
            modal.open();
          }
        } catch (e) {
          console.log(e);
        }
      });
    });
  }
}