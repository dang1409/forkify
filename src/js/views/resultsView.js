import View from './view.js';
import preView from './preView.js';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage =
    'No recipes found for your query. Please try again!No recipes found for your query. Please try again!';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => preView.render(result, false)).join('');
  }
}

export default new ResultsView();
