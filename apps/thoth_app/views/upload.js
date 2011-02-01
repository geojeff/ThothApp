// ========================================================================
// ThothApp.UploadView
// ========================================================================

/** @class

  Simplified from SCUI.UploadView

  @extends SC.View
  @author Jeff Pittman
*/

ThothApp.UploadView = SC.View.extend(
/** @scope ThothApp.Upload.prototype */ {

  /**
    Read-only value of the current selected file. In IE, this will include
    the full path whereas with all other browsers, it will only be the name of
    the file. If no file is selected, this will be set to null.
  */
  value: null,

  uploadTarget: '/upload',

  recordType: null,
  bucket: null,
  recordId: null,
  recordProperty: null,

  /**
    Array containing the upload approaches and the order in which to attempt them.  webkit based browsers will use xhr unless requestPrototype is set to null.
  */
  degradeList: ['xhr', 'iframe'],

  /**
    The server return value from the upload.  Will be set to null as the upload is started.
  */
  serverResponse: null,

  displayProperties: 'uploadTarget'.w(),

  render: function(context, firstTime) {
    var frameId = this.get('layerId') + 'Frame';
    var uploadTarget = this.get('uploadTarget');
    var label = this.get('label');

    context .begin('form')
      .attr('method', 'post')
      .attr('enctype', 'multipart/form-data')
      .attr('action', uploadTarget)
      .attr('target', frameId)

      .begin('input')
        .attr('type', 'text')
        .attr('name', 'title')
      .end()

      .begin('input')
        .attr('type', 'file')
        .attr('name', 'Filedata')
        .attr('multiple', 'multiple')
      .end()

    .end();

//    .begin('iframe')
//      .attr('frameBorder', 0)
//      .attr('src', '#')
//      .attr('id', frameId)
//      .attr('name', frameId)
//      .styles({ 'width': 0, 'height': 0 })
//    .end();

    sc_super();
  },

  mouseMoved: function(evt) {
    if (evt.target.nodeName === 'LABEL') {
      var ox = 0;
      var oy = 0;
      var elem = evt.target;

      if (elem.offsetParent) {
        ox = elem.offsetLeft;
        oy = elem.offsetTop;

        while (elem = elem.offsetParent) {
          ox += elem.offsetLeft;
          oy += elem.offsetTop;
        }
      }

      var x = evt.pageX - ox;
      var y = evt.pageY - oy;
      var w = evt.target.file.offsetWidth;
      var h = evt.target.file.offsetHeight;

      var input = this.$('input').firstObject();
      input.style.top   = y - (h / 2)  + 'px';
      input.style.left  = x - (w - 30) + 'px';
    }
  },

  didCreateLayer: function() {
    sc_super();
    var frame = this.$('iframe');
    var input = this.$('input');

    SC.Event.add(frame, 'load', this, this._uploadFetchIFrameContent);
    SC.Event.add(input, 'change', this, this._checkInputValue);
  },

  willDestroyLayer: function() {
    var frame = this.$('iframe');
    var input = this.$('input');

    SC.Event.remove(frame, 'load', this, this._uploadFetchIFrameContent);
    SC.Event.remove(input, 'change', this, this._checkInputValue);
    sc_super();
  },

  _startUploadXHR: function(f) {
    SC.Logger.log("using XHR");
    var fd, input, file;
    input = f['Filedata'];
    file = input.files[0];
    fd = new FormData();
    fd.append('Filedata', file);

    var storeKey = ThothApp.store.storeKeyFor(this.get('recordType'), this.get('recordId'));

    ThothApp.store.dataSource.uploadRequest(
      'prepareForUpload',
      { userData: { username: 'test', password: 'test'},
        opRequests: { resize: { small: { w: 32, h: 32 },
                                medium: { w: 128, h: 128 },
                                large: { w: 256, h: 256 }}},
        associated: [{ bucket: this.get('bucket'), key: storeKey, property: this.get('recordProperty')}] },
      function(data){
        ThothApp.store.dataSource.uploadFiles(data.uploadURL, fd);
      }
    )
  },

  _startUploadIframe: function (f) {
    SC.Logger.log("Using iframe target");
    f.submit();
  },

  /**
    Starts the file upload (by submitting the form)
  */
  startUpload: function() {
    var i, listLen, handler, f;
    this.set('serverResponse', null);

    f = this._getForm();
    if (!f) {
      return;
    }
//    for(i=0, listLen = this.degradeList.length; i<listLen; i++){
//      switch(this.degradeList[i]){
//        case 'xhr':
//          if ((SC.browser.safari || SC.browser.chrome) && (this.get('requestPrototype'))) {
//            handler = this._startUploadXHR.bind(this);
//          }
//        break;
//        case 'iframe':
//          handler = this._startUploadIframe.bind(this);
//        break;
//      }
//      if (handler) {
//        break;
//      }
//    }
    handler = this._startUploadXHR.bind(this);
    if (!handler) {
      SC.Logger.warn("No upload handler found!");
      return;
    }
    handler(f);
  },

  /**
    Clears the file upload by regenerating the HTML. This is guaranateed
    to work across all browsers.
  */
  clearFileUpload: function() {
    var f = this._getForm();
    if (f) {

      // remove event before calling f.innerHTML = f.innerHTML
      var input = this.$('input');
      SC.Event.remove(input, 'change', this, this._checkInputValue);

      f.innerHTML = f.innerHTML;
      this.set('value', null);

      // readd event
      input = this.$('input');
      SC.Event.add(input, 'change', this, this._checkInputValue);
    }
  },

  /**
    Returns true if a file has been chosen to be uploaded, otherwise returns
    false.

    @returns {Boolean} YES if a file is selected, NO if not
  */
  validateFileSelection: function() {
    var value = this.get('value');
    if (value) {
      return YES;
    }
    return NO;
  },

  _uploadCheck: function(response) {
    this.set('serverResponse', response.get('body'));
    this._uploadDone();
  },

  _uploadFetchIFrameContent: function() {
    var frame, response, win, doc;

    // get the json plain text from the iframe
    if (SC.browser.msie) {
      var frameId = '%@%@'.fmt(this.get('layerId'), 'Frame');
      frame = document.frames(frameId);
      doc = frame.document;
      if (doc) {
        if (doc.body.childNodes.length > 0) {
          response = frame.document.body.childNodes[0].innerHTML;
        }
      }
    } else {
      frame = this.$('iframe').get(0);
      win = frame.contentWindow;
      if (win) response = win.document.body.childNodes[0].innerHTML;
    }
    this.set('serverResponse', response);
  },

  /**
    This function is called when the value of the input changes (after the user hits the browse
    button and selects a file).
  */
  _checkInputValue: function() {
    SC.RunLoop.begin();
    var input = this._getInput();
    this.set('value', input.value);
    SC.RunLoop.end();
  },

  _getForm: function(){
    var forms = this.$('form');
    if (forms && forms.length > 0) return forms.get(0);
    return null;
  },

  _getInput: function() {
    var inputs = this.$('input');
    if (inputs && inputs.length > 0) return inputs.get(0);
    return null;
  }

});

