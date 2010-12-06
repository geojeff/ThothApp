// ==========================================================================
// Project:   ThothApp.BooksGraphicView
// ==========================================================================
/*globals ThothApp Sai*/

ThothApp.BooksGraphicView = Sai.CanvasView.extend({
  circles: [],

  renderCanvas: function(canvas, firstTime) {
    var i, c, key, len=ThothApp.Book.FIXTURES.get('length');
    if (firstTime) {
      var x = this.get('layout').width / 2;
      for (i=0; i<len; i++) {
        key = ThothApp.Book.FIXTURES[i].key;
        c = canvas.circle(x, (key * 20), 10);
        c.set('id', 'Book-%@'.fmt(key));
        c.set('stroke', 'black');
        c.set('strokeWidth', 1);
        if (this.isLoaded(key)) {
          c.set('fill', 'green');
        }
        this.circles.push(c);
      }
    } else {
      var loadedBookKeys = ThothApp.get('loadedBooks');
      for (i=0, len=loadedBookKeys.get('length'); i<len; i++) {
        c = this.findCircle('Book-%@'.fmt(loadedBookKeys[i]));
        if (c) {
          c.set('fill', 'green');
        }
      }
    }
  },

  isLoaded: function(key) {
    var loadedBooks = ThothApp.get('loadedBooks');
    for (var i=0, len=loadedBooks.get('length'); i<len; i++) {
      if (loadedBooks[i] == key) {
        return YES;
      }
    }
    return NO;
  },

  findCircle: function(id) {
    this.get('circles').forEach(function(circle) {
      if (circle.get('id') === id) return circle;
    });

    return NO;
  },

  mouseDown: function(evt) {
    console.log(evt.target);
  }

 });
