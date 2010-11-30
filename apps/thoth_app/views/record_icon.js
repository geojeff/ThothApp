// ==========================================================================
// Project:   ThothApp.RecordIconView
// ==========================================================================
/*globals ThothApp Sai*/

ThothApp.RecordIconView = Sai.CanvasView.design({

   renderCanvas: function(canvas, firstTime) {
     if (firstTime) {
       var c, y=10, yStep=20;

       for (var i=0; i<ThothApp.loadedReviewCount; i++) {
         c = canvas.circle(10, y, 10);
         c.set('fill', '#ff0000');
         c.set('id', 'blah');
         y += yStep;
       }
     }
   },

   mouseDown: function(evt) {
     console.log(evt.target);
   }

 });
