import icons from 'url:../../img/icons.svg';

// tạo class View chứa các phương thức render tổng quan
class View {
  _data;

  //render phần tử dựa trên dữ liệu gửi đến
  render(data, render = true) {
    //Nếu k có data hoặc data đó không phải 1 mảng nhiều hơn 1 phần tử thì render lỗi
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }
    this._data = data;

    // chạy phương thức tạo phần tử để render
    const markup = this._generateMarkup();
    if (!render) return markup;

    //xóa hết các phần tử cũ đã được render trước đó rồi render cái mới
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  //Phương thức update để làm mới phần tử
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    //Tạo ra một đối tượng DocumentFragment mới
    const newDom = document.createRange().createContextualFragment(newMarkup);

    //Lấy danh sách các phần tử HTML mới được tạo ra từ newDom, lưu trữ vào một mảng newElements
    const newElements = Array.from(newDom.querySelectorAll('*'));

    //Lấy danh sách các phần tử HTML cũ từ DOM hiện tại (_parentEl), lưu trữ vào một mảng curElements.
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    //So sánh từng phần tử nếu khác biệt thì thay thế bằng phần tử mới
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(function (attr) {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  //Phương thức render lỗi
  renderError(message = this._errorMessage) {
    const markup = ` <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div> `;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  //Phương thức render thông báo
  renderMessage(message = this._message) {
    const markup = ` <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div> `;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  //Phương thức để rendẻr hiệu ứng load
  showLoading() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div> 
  `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  //Phương thức xóa các render cũ
  _clear() {
    this._parentEl.innerHTML = '';
  }
}

export default View;
