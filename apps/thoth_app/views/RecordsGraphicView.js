// ==========================================================================
// Project:   ThothApp.RecordsGraphicView
// ==========================================================================
/*globals ThothApp Sai*/

ThothApp.RecordsGraphicView = Sai.CanvasView.extend({
  circles: [],
  recordTypes: [ThothApp.Review, ThothApp.Version, ThothApp.Book, ThothApp.Author],
  iconColors: ['green', 'blue', 'yellow', 'red'],
  //iconStyleFuncs: [Sai.Canvas.circle, Sai.Canvas.circle, Sai.Canvas.circle, Sai.Canvas.circle],
  iconSizes: [10, 10, 10, 10],

  connectionPointSize: 5,
  connectionLineWidth: 2,

  renderCanvas: function(canvas, firstTime) {
    var i, lenRecordTypes = this.get('recordTypes').get('length');

    if (firstTime) {
      var rowHeight = 10000, columnWidth = this.get('layout').width / (lenRecordTypes+1);

      for (i=0; i<lenRecordTypes; i++) {
        rowHeight = Math.min(rowHeight, this.get('layout').height / (this.get('recordTypes').objectAt(i).FIXTURES.get('length')+1));
      }

      for (i=0; i<lenRecordTypes; i++) {
        var j, c, key,
            lenFixtures = this.get('recordTypes').objectAt(i).FIXTURES.get('length'),
            recordTypeStringLong = this.get('recordTypes').objectAt(i).toString(),
            recordTypeStringShort =  recordTypeStringLong.slice(recordTypeStringLong.indexOf('.')+1,
                                                                recordTypeStringLong.length);
            //iconStyleFunc = this.get('iconStyles').objectAt(i);

        for (j=0; j<lenFixtures; j++) {
          key = this.get('recordTypes').objectAt(i).FIXTURES[j].key;
          c = canvas.circle(columnWidth * (i+1), (key * rowHeight), this.get('iconSizes').objectAt(i));
          c.set('id', this.idFor(recordTypeStringShort, key));
          c.set('stroke', 'black');
          c.set('strokeWidth', 1);
          this.circles.push(c);
          if (this.isLoaded(recordTypeStringShort, key)) {
            var childRecords = [];
            c.set('fill', this.get('iconColors').objectAt(i));
            switch (recordTypeStringLong) {
              case 'ThothApp.Review':
                break;
              case 'ThothApp.Version':
                var p1, p2, l, childKey,
                    reviewColumn = this.get('recordTypes').indexOf(ThothApp.Review)+1;
                var lenReviews = this.get('recordTypes').objectAt(i).FIXTURES[key-1].reviews.get('length');
                for (var k=0; k<lenReviews; k++) {
                  childKey = this.get('recordTypes').objectAt(i).FIXTURES[key-1].reviews[k];
                  p1 = canvas.circle(columnWidth * (i+1), (key * rowHeight), 5);
                  p1.set('id', this.idFor('connection-point-version', key));
                  p1.set('stroke', 'black');
                  p1.set('fill', 'black');
                  p2 = canvas.circle(columnWidth * reviewColumn, (childKey * rowHeight), 5);
                  p2.set('id', this.idFor('connection-point-review', key));
                  p2.set('stroke', 'black');
                  p2.set('fill', 'black');
                  l = canvas.path('M%@,%@ L%@,%@'.fmt(columnWidth * (i+1),
                                                      (key * rowHeight),
                                                      columnWidth * reviewColumn,
                                                      (childKey * rowHeight)));
                  l.set('id', this.idFor('connection-line-version-%@-to-review'.fmt(key), childKey));
                  l.set('stroke', 'black');
                  l.set('strokeWidth', 2);
                }
                break;
              case 'ThothApp.Book':
                break;
              case 'ThothApp.Author':
                break;
            }
          }
        }
      }
    } else {
      for (i=0; i<lenRecordTypes; i++) {
        var recordTypeStringLong = this.get('recordTypes').objectAt(i).toString(),
            recordTypeStringShort = recordTypeStringLong.slice(recordTypeStringLong.indexOf('.')+1,
                                                               recordTypeStringLong.length);

        var loadedRecordKeys = ThothApp.get('loaded%@s'.fmt(recordTypeStringShort));

        for (var j=0, len=loadedRecordKeys.get('length'); j<len; j++) {
          c = this.findCircle(this.idFor(recordTypeStringShort, loadedRecordKeys[j]));
          if (c) {
            c.set('fill', this.get('iconColors').objectAt(i));
          }
        }
      }
    }
  },

  idFor: function(recordTypeString, key) {
    return '%@-%@'.fmt(recordTypeString, key);
  },

  isLoaded: function(recordTypeString, key) {
    var loadedRecordKeys = ThothApp.get('loaded%@s'.fmt(recordTypeString));
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
