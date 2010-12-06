// ==========================================================================
// Project:   ThothApp.AuthorsGraphicView
// ==========================================================================
/*globals ThothApp Sai*/

ThothApp.AuthorsGraphicView = Sai.CanvasView.extend({
  circles: [],

  renderCanvas: function(canvas, firstTime) {
    var i, c, key, len=ThothApp.Author.FIXTURES.get('length');
    if (firstTime) {
      var x = this.get('layout').width / 2;
      for (i=0; i<len; i++) {
        key = ThothApp.Author.FIXTURES[i].key;
        c = canvas.circle(x, (key * 20), 10);
        c.set('id', 'Author-%@'.fmt(key));
        c.set('stroke', 'black');
        c.set('strokeWidth', 1);
        if (this.isLoaded(key)) {
          c.set('fill', 'red');
        }
        this.circles.push(c);
      }
    } else {
      var loadedAuthorKeys = ThothApp.get('loadedAuthors');
      for (i=0, len=loadedAuthorKeys.get('length'); i<len; i++) {
        c = this.findCircle('Author-%@'.fmt(loadedAuthorKeys[i]));
        if (c) {
          c.set('fill', 'red');
        }
      }
    }
  },

  isLoaded: function(key) {
    var loadedAuthors = ThothApp.get('loadedAuthors');
    for (var i=0, len=loadedAuthors.get('length'); i<len; i++) {
      if (loadedAuthors[i] == key) {
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
