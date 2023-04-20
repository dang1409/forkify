import View from './view.js';
import icons from 'url:../../img/icons.svg';

//Render Pagination
class PaginationVIew extends View {
  _parentEl = document.querySelector('.pagination');

  //Lấy số trang để đưa vào handler
  addHandlerPagination(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    console.log(this._data);
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );

    // ở trang đầu
    if (curPage == 1 && curPage < numPages) {
      return `
            <button data-goto=${
              curPage + 1
            } class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button> 
        `;
    }

    // ở giữa
    if (curPage > 1 && curPage < numPages) {
      return `
            <button data-goto=${
              curPage - 1
            } class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>  
                <span>Page ${curPage - 1}</span>
            </button>
            <button data-goto=${
              curPage + 1
            } class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button> 
        `;
    }

    // trang cuối
    if (curPage == numPages && curPage != 1) {
      return `
            <button data-goto=${
              curPage - 1
            } class="btn--inline pagination__btn--prev">
              <svg class="search__icon">
                  <use href="${icons}#icon-arrow-left"></use>
              </svg>  
              <span>Page ${curPage - 1}</span>
            </button>
        `;
    }

    //1 trang duy nhất
    return '';
  }
}

export default new PaginationVIew();
