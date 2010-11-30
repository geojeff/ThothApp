// ==========================================================================
// Project:   ThothApp.GraphicView
// ==========================================================================
/*globals ThothApp Sai*/

ThothApp.GraphicView = Sai.CanvasView.design({

  renderCanvas: function(canvas, firstTime) {
    if (firstTime) {
      this.addRecordIcons(canvas, ThothApp.Review, 10, 10, 20);
      this.addRecordIcons(canvas, ThothApp.Version, 40, 10, 20);
      this.addRecordIcons(canvas, ThothApp.Book, 70, 10, 20);
      this.addRecordIcons(canvas, ThothApp.Author, 100, 10, 20);
    }
  },

  addRecordIcons: function(canvas, recordType, xStart, yStart, yStep) {
    var x=xStart, y=yStart, count=0, fixturesCount=0, recordTypeString='', recordTypeColor='ffffff';

    switch (recordType.toString()) {
      case 'ThothApp.Review':
        recordTypeString = 'review';
        recordTypeColor = '#ff0000';
        count = ThothApp.loadedReviewCount;
        fixturesCount = ThothApp.Review.FIXTURES.get('length');
        break;
      case 'ThothApp.Version':
        recordTypeString = 'version';
        recordTypeColor = '#00ff00';
        count = ThothApp.loadedVersionCount;
        fixturesCount = ThothApp.Version.FIXTURES.get('length');
        break;
      case 'ThothApp.Book':
        recordTypeString = 'book';
        recordTypeColor = '#0000ff';
        count = ThothApp.loadedBookCount;
        fixturesCount = ThothApp.Book.FIXTURES.get('length');
        break;
      case 'ThothApp.Author':
        recordTypeString = 'author';
        recordTypeColor = '#00ffff';
        count = ThothApp.loadedAuthorCount;
        fixturesCount = ThothApp.Author.FIXTURES.get('length');
        break;
      default:
        recordTypeString = 'none';
        recordTypeColor = '#000000';
        count = 0;
        fixturesCount = 0;
        break;
    }

    var i, c;
    if (count > 0) {
      for (i=0; i<count; i++) {
        c = canvas.circle(x, y, 10);
        c.set('fill', recordTypeColor);
        c.set('id', '%@-%@'.fmt(recordTypeString, i));
        y += yStep;
      }
    } else {
      for (i=0; i<fixturesCount; i++) {
        c = canvas.circle(x, y, 10);
        c.set('fill', '#ffffff');
        c.set('fill-opacity', 0.5);
        c.set('stroke', '#000000');
        c.set('stroke-width', 1);
        c.set('stroke-dasharray', '-..');
        //c.set('stroke-dasharray', ['', '-', '.', '-.', '-..', '. ', '- ', '--', '- .', '--.', '--..']);
        c.set('id', '%@-%@'.fmt(recordTypeString, i));
        y += yStep;
      }
    }
  },

  mouseDown: function(evt) {
    console.log(evt.target);
  }

 });
