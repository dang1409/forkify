import View from './view.js';
import preView from './preView.js';

// render bookMark
class BookMarkView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find  a nnice recipe and bookmark it';
  _message = '';

  // phương thức chạy handler mỗi khi load web
  addHandlerBookmark(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data.map(result => preView.render(result, false)).join('');
  }
}

export default new BookMarkView();
