/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.login( data, ( err, response ) => {
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