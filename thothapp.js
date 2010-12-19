var g = require('../garcon/lib/garçon'),
    server = new g.Server({ port: 8010, proxyHost: 'localhost', proxyPort: 8080});

myApp = server.addApp({
  name: 'thoth_app',
  theme: 'sc-theme'
  //theme: 'ace',
  //buildLanguage: 'french'
});

myApp.addSproutcore();

myApp.addFrameworks(
//  { path: 'frameworks/calendar' },
//  { path: 'themes/my_theme' },
  //{ path: 'frameworks/sproutcore/themes/ace'},
  { path: 'frameworks/sproutcore/themes/empty_theme'},
  { path: 'frameworks/sproutcore/themes/empty_theme'},
  { path: 'frameworks/sproutcore/themes/standard_theme'},
  { path: 'frameworks/sproutcore/frameworks/animation'}, 
  { path: 'frameworks/sproutcore/frameworks/statechart'},
  { path: 'frameworks/sproutcore/frameworks/forms'},  
  { path: 'frameworks/Thoth-SC'}, // add thoth
  { path: 'frameworks/scui/frameworks/foundation'},
  { path: 'frameworks/scui/frameworks/sai'},  
  { path: 'frameworks/scui/frameworks/linkit'},
  { path: 'frameworks/scui/frameworks/drawing'},    
  { path: 'frameworks/scui/frameworks/calendar'},
  { path: 'frameworks/scui/frameworks/dashboard'},
  { path: 'apps/thoth_app'} //, buildLanguage: 'french' }
);

myApp.htmlHead = '<title>Thoth Test App</title>';

myApp.htmlBody = [
  '<div id="loading">',
    '<p id="loading">',
	    'Loading…',
	  '</p>',
  '</div>'
].join('\n');

myApp.build();

server.run();
