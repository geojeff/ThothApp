// ==========================================================================
// Project:   ThothApp.VersionsGraphicView
// ==========================================================================
/*globals ThothApp Sai*/

ThothApp.VersionsGraphicView = Sai.CanvasView.extend({
  circles: [],

  renderCanvas: function(canvas, firstTime) {
    var i, c, key, len=ThothApp.Version.FIXTURES.get('length');
    if (firstTime) {
      var x = this.get('layout').width / 2;
      for (i=0; i<len; i++) {
        key = ThothApp.Version.FIXTURES[i].key;
        c = canvas.circle(x, (key * 20), 10);
        c.set('id', 'Version-%@'.fmt(key));
        c.set('stroke', 'black');
        c.set('strokeWidth', 1);
        if (this.isLoaded(key)) {
          c.set('fill', 'yellow');
        }
        this.circles.push(c);
      }
    } else {
      var loadedVersionKeys = ThothApp.get('loadedVersions');
      for (i=0, len=loadedVersionKeys.get('length'); i<len; i++) {
        c = this.findCircle('Version-%@'.fmt(loadedVersionKeys[i]));
        if (c) {
          c.set('fill', 'yellow');
        }
      }
    }
  },

  isLoaded: function(key) {
    var loadedVersions = ThothApp.get('loadedVersions');
    for (var i=0, len=loadedVersions.get('length'); i<len; i++) {
      if (loadedVersions[i] == key) {
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
