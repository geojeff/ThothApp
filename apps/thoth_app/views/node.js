/**
 * @class ThothApp.NodeView
 * @extends SC.View
 * @author Jeff Pittman
 *
 * @version 0.1
 * @since 0.1
 */
 /*globals LinkIt ThothApp*/

ThothApp.NodeView = SC.View.extend(LinkIt.NodeView, {
  layout: { top: 0, left: 0, width: 80, height: 32 },
  displayProperties: ['content', 'isSelected'],

  content: null,

  render: function(context){
    var c = this.get('content');

    if (c) {
      if (c.get('isAuthor')) {
        context.addClass('author');
      } else if (c.get('isBook')) {
        context.addClass('book');
      } else if (c.get('isVersion')) {
        context.addClass('version');
      } else if (c.get('isReview')) {
        context.addClass('review');
      }
    }

    sc_super();

    if (this.get("isSelected")) context.addClass("selected");
  },

  createChildViews: function(){
    var childViews = [], contentView;
    var content = this.get('content');

    console.log('in ccv', content);

    if(SC.none(content)) return;

    if(content.get('isAuthor')){
      console.log('pushing author views');
      // This is the content of the view
      contentView = this.createChildView(
        SC.LabelView.extend({
          classNames: ['name'],
          content: content,
          isEditable: YES,
          layout: { centerY: 0, centerX: 0, width: 100, height: 25},
          textAlign: SC.ALIGN_CENTER,
          valueBinding: SC.binding('.name', content)
        })
      );
      childViews.push(contentView);

      // Author is the root, so has no input terminal.

      // Books terminal
      this._term_books = this.createChildView(
        SC.View.extend(LinkIt.Terminal, {
          classNames: ['books-terminal'],
          layout: { bottom: -5, centerX: 0, width: 10, height: 10 },
          linkStyle: { lineStyle: LinkIt.STRAIGHT, width: 3, color: '#AEE76B', cap: LinkIt.ROUND},
          node: content,
          terminal: 'books',
          direction: LinkIt.OUTPUT_TERMINAL
        })
      );
      childViews.push(this._term_books);

    } else if(content.get('isBook')) {
      console.log('pushing book views');
      // This is the content of the view
      contentView = this.createChildView(
        SC.LabelView.extend({
          classNames: ['name'],
          content: content,
          isEditable: YES,
          layout: { centerY: 0, centerX: 0, width: 100, height: 25},
          textAlign: SC.ALIGN_CENTER,
          valueBinding: SC.binding('.name', content)
        })
      );
      childViews.push(contentView);

      // Author Terminal
      this._term_author = this.createChildView(
        SC.View.extend(LinkIt.Terminal, {
          classNames: ['author-terminal'],
          layout: { top: -5, centerX: 0, width: 10, height: 10 },
          linkStyle: { lineStyle: LinkIt.STRAIGHT, width: 3, color: '#E08CDF', cap: LinkIt.ROUND},
          node: content,
          terminal: 'author',
          direction: LinkIt.INPUT_TERMINAL
        })
      );
      childViews.push(this._term_author);

      // Versions terminal
      this._term_versions = this.createChildView(
        SC.View.extend(LinkIt.Terminal, {
          classNames: ['versions-terminal'],
          layout: { bottom: -5, centerX: 0, width: 10, height: 10 },
          linkStyle: { lineStyle: LinkIt.STRAIGHT, width: 3, color: '#AEE76B', cap: LinkIt.ROUND},
          node: content,
          terminal: 'versions',
          direction: LinkIt.OUTPUT_TERMINAL
        })
      );
      childViews.push(this._term_versions);

    } else if(content.get('isVersion')) {
      console.log('pushing version views');
      // This is the content of the view
      contentView = this.createChildView(
        SC.LabelView.extend({
          classNames: ['name'],
          content: content,
          isEditable: YES,
          layout: { centerY: 0, centerX: 0, width: 100, height: 25},
          textAlign: SC.ALIGN_CENTER,
          valueBinding: SC.binding('.name', content)
        })
      );
      childViews.push(contentView);

      // Book Terminal
      this._term_book = this.createChildView(
        SC.View.extend(LinkIt.Terminal, {
          classNames: ['book-terminal'],
          layout: { top: -5, centerX: 0, width: 10, height: 10 },
          linkStyle: { lineStyle: LinkIt.STRAIGHT, width: 3, color: '#E08CDF', cap: LinkIt.ROUND},
          node: content,
          terminal: 'book',
          direction: LinkIt.INPUT_TERMINAL
        })
      );
      childViews.push(this._term_book);

      // Reviews terminal
      this._term_reviews = this.createChildView(
        SC.View.extend(LinkIt.Terminal, {
          classNames: ['reviews-terminal'],
          layout: { bottom: -5, centerX: 0, width: 10, height: 10 },
          linkStyle: { lineStyle: LinkIt.STRAIGHT, width: 3, color: '#AEE76B', cap: LinkIt.ROUND},
          node: content,
          terminal: 'reviews',
          direction: LinkIt.OUTPUT_TERMINAL
        })
      );
      childViews.push(this._term_reviews);

    } else if(content.get('isReview')) {
      console.log('pushing review views');
      // This is the content of the view
      contentView = this.createChildView(
        SC.LabelView.extend({
          classNames: ['name'],
          content: content,
          isEditable: YES,
          layout: { centerY: 0, centerX: 0, width: 100, height: 25},
          textAlign: SC.ALIGN_CENTER,
          valueBinding: SC.binding('.name', content)
        })
      );
      childViews.push(contentView);

      // Version Terminal
      this._term_version = this.createChildView(
        SC.View.extend(LinkIt.Terminal, {
          classNames: ['version-terminal'],
          layout: { right: 40, top: -5, width: 10, height: 10 },
          linkStyle: { lineStyle: LinkIt.STRAIGHT, width: 3, color: '#E08CDF', cap: LinkIt.ROUND},
          node: content,
          terminal: 'version'
        })
      );
      childViews.push(this._term_version);

      // Review is the leaf, so has no output terminal.

    }

    this.set('childViews', childViews);
  },

  // ..........................................................
  // LINKIT Specific for the view
  //
  /**
    Implements LinkIt.NodeView.terminalViewFor()
  */
  terminalViewFor: function(terminalKey) {
    console.log(terminalKey);
    return this['_term_' + terminalKey];
  }
});
