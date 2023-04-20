import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config';
import { GET_JSON, SEND_JSON } from './helpers';

//state
export const state = {
  recipe: {},
  search: {
    query: '',
    page: 1,
    results: [],
    resultPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

//lấy recipe qua id
export const loadRecipe = async function (id) {
  try {
    const data = await GET_JSON(`${API_URL}/${id}?key=${KEY}`);

    //Lưu data vào state
    state.recipe = createRecipeObject(data);

    //Nếu có bookmark thì lưu bookmark = true cho logic xóa thêm ở controller.js
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    }
  } catch (err) {
    throw `${err} `;
  }
};

//load danh sách công thức theo từ truy vấn
export const loadSearchRecipe = async function (query) {
  try {
    state.search.query = query;
    const data = await GET_JSON(`${API_URL}?search=${query}&key=${KEY}`);

    //update vào results
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        image: rec.image_url,
        publisher: rec.publisher,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    throw `${err} `;
  }
};

//Lấy danh sách công thức render dựa trên page tương ứng
export const getSearchResultsPage = function (page = state.search.page) {
  //cập nhập lại page trong state
  state.search.page = page;

  //Lấy số danh sách cuar page
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;

  return state.search.results.slice(start, end);
};

//Update Service
export const updateService = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};
//Lưu bookmark vâo localstorage để dùng khi load lại web
const persistBookmark = function () {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmarks));
};

//add bookmark
export const addBookMark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  persistBookmark();
};

//xóa bookmark
export const deleteBookMark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  persistBookmark();
};

const init = function () {
  const storage = localStorage.getItem('bookmark');

  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
};

init();

const clearBookmark = function () {
  localStorage.removeItem('bookmark');
};

// clearBookmark();ssss

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '') // tìm các phần bứt đầu bằng ingrredient và value k rỗng
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(','); // tấch chuỗi thành mảng

        if (ingArr.length !== 3) {
          throw new Error('Wrong ingredients format');
        }
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await SEND_JSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};
