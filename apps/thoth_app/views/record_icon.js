// ==========================================================================
// Project:   ThothApp.RecordIconView
// ==========================================================================
/*globals ThothApp Sai*/

ThothApp.RecordIconView = Sai.CanvasView.extend({

   renderCanvas: function(canvas, firstTime) {
     if (firstTime) {
       var c = canvas.circle(80, 80, 50);
       c.set('fill', '#ff0000');
       c.set('id', 'blah');
     }
   },

   mouseDown: function(evt) {
     console.log(evt.target);
   }

 });
