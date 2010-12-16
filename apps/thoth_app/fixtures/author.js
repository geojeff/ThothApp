// ==========================================================================
// Project:   ThothApp.Author Fixtures
// ==========================================================================
/*globals ThothApp*/

sc_require('models/author');

ThothApp.Author.FIXTURES = [
  { key: 1, lastName: 'Twain',   firstName: 'Mark',    books: [1,2,4,5], position: {y:  50, x: 100} },
  { key: 2, lastName: 'Crane',   firstName: 'Stephen', books: [3],       position: {y: 100, x: 100} },
  { key: 3, lastName: 'Kipling', firstName: 'Rudyard', books: [6],       position: {y: 150, x: 100} }
];


