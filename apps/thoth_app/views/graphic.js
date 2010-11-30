// ==========================================================================
// Project:   ThothApp.GraphicView
// ==========================================================================
/*globals ThothApp Sai*/

ThothApp.GraphicView = Sai.CanvasView.design({

   renderCanvas: function(canvas, firstTime) {
     if (firstTime) {
       var i, c, x=10, y=10, yStep=20;

       for (i=0; i<ThothApp.loadedReviewCount; i++) {
         c = canvas.circle(x, y, 10);
         c.set('fill', '#ff0000');
         c.set('id', 'review-%@'.fmt(i));
         y += yStep;
       }

       x=40, y=10;
       for (i=0; i<ThothApp.loadedVersionCount; i++) {
         c = canvas.circle(x, y, 10);
         c.set('fill', '#00ff00');
         c.set('id', 'version-%@'.fmt(i));
         y += yStep;
       }

       x=70, y=10;
       for (i=0; i<ThothApp.loadedBookCount; i++) {
         c = canvas.circle(x, y, 10);
         c.set('fill', '#0000ff');
         c.set('id', 'book-%@'.fmt(i));
         y += yStep;
       }

       x=100, y=10;
       for (i=0; i<ThothApp.loadedAuthorCount; i++) {
         c = canvas.circle(x, y, 10);
         c.set('fill', '#00ffff');
         c.set('id', 'author-%@'.fmt(i));
         y += yStep;
       }

     }
   },

   mouseDown: function(evt) {
     console.log(evt.target);
   }

 });
