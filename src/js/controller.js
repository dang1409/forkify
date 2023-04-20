import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipesView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookMarkView from './views/bookMarkVIew.js';
import addRecipeView from './views/addRecipeView.js';
import { TIMEOUT_SEC_CLOSE_WINDOW } from './config.js';

// https://forkify-api.herokuapp.com/v2

/////////////////////////////////

const controlrecipe = async function () {
  try {
    const id = window.location.hash.slice(1); // get id from hash

    if (!id) return;

    //hiển thị pending
    recipesView.showLoading();

    //cập nhập lại danh sách công thức
    resultsView.update(model.getSearchResultsPage());

    //cập nhập lại danh sách bookmarks
    bookMarkView.update(model.state.bookmarks);

    //Cập nhập lại recipe trong state với id mới
    await model.loadRecipe(id);

    //render ra recipe
    recipesView.render(model.state.recipe);
  } catch (error) {
    recipesView.renderError();
    console.error(error);
  }
};

const controlSearchRecipe = async function () {
  try {
    //pending
    resultsView.showLoading();

    //lấy query
    const query = searchView.getQuery();

    if (!query) return;

    //update danh sách theo từ truy vấn vào state
    await model.loadSearchRecipe(query);

    //render ititial
    resultsView.render(model.getSearchResultsPage(1));
    paginationView.render(model.state.search);
  } catch (error) {
    resultsView.renderError();
  }
};

//Danh sách tương ứng với page mỗi khi page thay đổi
const controlPagination = function (gotoPage) {
  //render công thức tương ứng với page
  resultsView.render(model.getSearchResultsPage(gotoPage));

  //render pagination
  paginationView.render(model.state.search);
};

const controlUpdateService = function (newServings) {
  //update Serving trong state
  model.updateService(newServings);

  //update recipe theo Serving trong state
  recipesView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookMark(model.state.recipe);
  } else {
    model.deleteBookMark(model.state.recipe.id);
  }
  //update lại recipe do icon bookmark đc thay đổi
  recipesView.update(model.state.recipe);

  //render bookmark
  bookMarkView.render(model.state.bookmarks);
};

//Mỗi khi load sẽ render bookmark
const controlBookMark = function () {
  bookMarkView.render(model.state.bookmarks);
};

//upload new recipe
const controlUploadRecipe = async function (newRecipe) {
  try {
    //pending
    addRecipeView.showLoading();

    await model.uploadRecipe(newRecipe);

    //render lại công thức sau khi update new recipe
    recipesView.render(model.state.recipe);

    //render thông báo thành công
    addRecipeView.renderMessage();

    //render lại bookmarks
    bookMarkView.render(model.state.bookmarks);

    //change Id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleClass();
    }, TIMEOUT_SEC_CLOSE_WINDOW * 1000);

    console.log(model.state.recipe);
  } catch (e) {
    console.error(e);
    addRecipeView.renderError(e.message);
  }
};

const init = function () {
  //Mỗi khi load sẽ render bookmark
  bookMarkView.addHandlerBookmark(controlBookMark);

  //Mỗi khi thay đổi page sẽ cập nhập lại danh sách cũng như pagination
  paginationView.addHandlerPagination(controlPagination);

  //Thực hiện control recipee mỗi khi load hoặc thay đổi hash
  recipesView.addHandlerRender(controlrecipe);

  //Thực hiện controlUpdateService khi update sống lượng người trong công thức
  recipesView.addHandlerUpdate(controlUpdateService);

  //Thực hiện controlAddBookMark mỗi khi click vâo btn bookmark
  recipesView.addHandlerBookmark(controlAddBookMark);

  //Thực hiện controlSearchRecipe mỗi khi tìm kiếm
  searchView.addHandlerSearch(controlSearchRecipe);

  //Thực hiện khi upload new recipe
  addRecipeView.addHandlerUpload(controlUploadRecipe);
};
init();
