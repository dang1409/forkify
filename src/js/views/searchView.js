import View from './view.js';

class SearchView extends View {
  _parentEl = document.querySelector('.search');

  //Lấy giá trị đã nhập trên thanh tìm kiếm
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  //clear thanh search
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
