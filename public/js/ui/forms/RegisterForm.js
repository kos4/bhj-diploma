/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.register( data, ( err, response ) => {
      if (err) {
        alert(`Ошибка ${err.code}. ${err.message}`);
      } else {
        if (response.success === true) {
          this.setUser(response.user);
          this.closeForm();
        } else {
          alert(response.error);
        }
      }
    });
  }
}