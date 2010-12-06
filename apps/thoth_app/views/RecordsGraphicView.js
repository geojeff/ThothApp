// ==========================================================================
// Project:   ThothApp.RecordsGraphicView
// ==========================================================================
/*globals ThothApp Sai*/

ThothApp.RecordsGraphicView = Sai.CanvasView.extend({
  circles: [],
  recordType: null,
  iconColor: 'white',

  _recordTypeStringShort: null, // e.g., Review
  _recordTypeStringLong: null,  // e.g., ThothApp.Review

  renderCanvas: function(canvas, firstTime) {
    var i, c, key, len=this.recordType.FIXTURES.get('length');
    if (firstTime) {
      console.log('yo');
      // Set recordTypeString for later use
      this.set('_recordTypeStringLong', this.recordType.toString());
      this.set('_recordTypeStringShort',
               this._recordTypeStringLong.slice(this._recordTypeStringLong.indexOf('.')+1,
                                                this._recordTypeStringLong.length));

      var x = this.get('layout').width / 2;

      for (i=0; i<len; i++) {
        key = this.recordType.FIXTURES[i].key;
        c = canvas.circle(x, (key * 20), 10);
        c.set('id', this.idFor(key));
        c.set('stroke', 'black');
        c.set('strokeWidth', 1);
        if (this.isLoaded(key)) {
          c.set('fill', this.get('iconColor'));
        }
        this.circles.push(c);
      }
    } else {
      var loadedRecordKeys = ThothApp.get('loaded%@s'.fmt(this._recordTypeStringShort));
      for (i=0, len=loadedRecordKeys.get('length'); i<len; i++) {
        c = this.findCircle(this.idFor(loadedRecordKeys[i]));
        if (c) {
          c.set('fill', this.get('iconColor'));
        }
      }
    }
  },

  idFor: function(key) {
    return '%@-%@'.fmt(this._recordTypeStringShort, key);
  },

  isLoaded: function(key) {
    var loadedRecordKeys = ThothApp.get('loaded%@s'.fmt(this._recordTypeStringShort));
    for (var i=0, len=loadedRecordKeys.get('length'); i<len; i++) {
      if (loadedRecordKeys[i] == key) {
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
  },

  mouseUp: function(evt) {
    console.log(evt.target);
  }

 });
