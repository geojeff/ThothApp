// ==========================================================================
// Project:   ThothApp.Book Fixtures
// ==========================================================================
/*globals ThothApp*/

sc_require('models/book');

ThothApp.Book.FIXTURES = [
  { key: 1, title: "The Adventures of Tom Sawyer",       author: 1, versions: [1],   position: {y:  50, x: 200}},
  { key: 2, title: "The Adventures of Huckleberry Finn", author: 1, versions: [2,3], position: {y: 100, x: 200}},
  { key: 3, title: "The Red Badge of Courage",           author: 2, versions: [4],   position: {y:  50, x: 200}},
  { key: 4, title: "The Autobiography of Mark Twain",    author: 1, versions: [5],   position: {y: 150, x: 200}},
  { key: 5, title: "Life on the Mississippi",            author: 1, versions: [6,7], position: {y: 200, x: 200}},
  { key: 6, title: "The Jungle Book",                    author: 3, versions: [8],   position: {y:  50, x: 200}},
  { key: 7, title: "Captains Courageous",                author: 3, versions: [9],   position: {y:  50, x: 200}}
];


