import View from './view.js';

// Tạo lớp AddRecipeView để thêm bảng tạo công thức
class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _message = 'Recipe was successfully uploaded';

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  // đóng mở bảng công thức
  toggleClass() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  // tạo phương thức đóng mở khi click
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleClass.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleClass.bind(this));
    this._overlay.addEventListener('click', this.toggleClass.bind(this));
  }

  // gửi data vào handler
  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();

      // chuyển qua mảng Array 2 chiều từ dữ liệu lấy được rồi chuyển qua obj
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);

      // xử lý data đc submit
      handler(data);
    });
  }
}

export default new AddRecipeView();
