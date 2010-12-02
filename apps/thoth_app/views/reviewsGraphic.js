// ==========================================================================
// Project:   ThothApp.ReviewsGraphicView
// ==========================================================================
/*globals ThothApp Sai*/

ThothApp.ReviewsGraphicView = Sai.CanvasView.design({
  layout: { top: 0, bottom: 0, left: 0, right: 0 },
  circles: [],

  renderCanvas: function(canvas, firstTime) {
    var i, c, key, len=ThothApp.Review.FIXTURES.get('length');
    if (firstTime) {
      for (i=0; i<len; i++) {
        key = ThothApp.Review.FIXTURES[i].key;
        c = canvas.circle(10, (key * 20), 10);
        c.set('id', 'Review-%@'.fmt(key));
        c.set('stroke', 'black');
        c.set('strokeWidth', 1);
        if (this.isLoaded(key)) {
          c.set('fill', 'blue');
        }
        this.circles.push(c);
      }
    } else {
      var loadedReviewKeys = ThothApp.get('loadedReviews');
      for (i=0, len=loadedReviewKeys.get('length'); i<len; i++) {
        c = this.findCircle('Review-%@'.fmt(loadedReviewKeys[i]));
        if (c) {
          c.set('fill', 'blue');
        }
      }
    }
  },

  isLoaded: function(key) {
    var loadedReviews = ThothApp.get('loadedReviews');
    for (var i=0, len=loadedReviews.get('length'); i<len; i++) {
      if (loadedReviews[i] == key) {
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
