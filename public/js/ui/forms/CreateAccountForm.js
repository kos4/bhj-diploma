/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(data, (err, response) => {
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