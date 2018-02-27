# Media Manager

Media Manager is an open source web file manager and can be a nice alternative to Wordpress Media Manager, CKFinder, KCFinder, elFinder... It is still in its early stages, but feel free to use it, report bugs and contribute.

![screenshot](doc/images/mm01.jpg)

This project use Javascript and :
- [Webpack](https://github.com/webpack/webpack)
- [VueJS 2](https://github.com/vuejs/vue)
- [Vuex](https://github.com/vuejs/vuex)
- [Axios](https://github.com/mzabriskie/axios)
- [Bootstrap](https://github.com/twbs/bootstrap)
- [Font Awesome](https://github.com/FortAwesome/Font-Awesome)

## Demo

[https://www.iutbayonne.univ-pau.fr/~klevron/mm/](https://www.iutbayonne.univ-pau.fr/~klevron/mm/)

## Features

- [x] Backends (by using [flysystem](https://github.com/thephpleague/flysystem)) :
  - [x] Local
  - [x] FTP
  - [x] SFTP
  - [x] ... 
- [x] Drag&drop file upload
- [x] Multiple file upload
- [x] Image preview
- [x] Input option
- [ ] Multilanguage
- [ ] File actions :
  - [x] Details
  - [x] Download
  - [ ] Rename / Move
  - [ ] Delete
- [ ] Folder actions :
  - [x] Details
  - [ ] Download
  - [ ] Rename / Move
  - [ ] Delete
- [x] Context menu
- [x] vuejs component
- [x] npm package
- [ ] Integration :
  - [ ] CKEditor plugin
  - [ ] TinyMCE plugin
  - [ ] Drupal module

## Install

### Client
```
<link href="mm.min.css" rel="stylesheet">
...
<script src="mm.min.js"></script>
```

or
```
npm install mm
```

and

```
import { MM } from 'mm'
require('mm/dist/style.css')
```

### Server

Media Manager is a client side tool, it will display files located on a server, it needs a web service to communicate with :
- you can use a simple server : [mm-server](https://github.com/iutbay/mm-server),
- or you can build your own, take a look at [API doc](doc/API.md).

## Usage in pure JavaScript

**HTML**
```html
<div id="media-manager"></div>
```
**JavaScript**
```javascript
new MM({
    el: '#media-manager',
    api: {
        baseUrl: 'https://server.com/api/',
        listUrl: 'list',
        downloadUrl: 'download',  // optional
        uploadUrl: 'upload',      // optional
        deleteUrl: 'delete'       // optional
    }
});
```

### With input

**HTML**
```html
<input type="text" id="file-input">
<div id="media-manager"></div>
```

**JavaScript**
```javascript
new MM({
    el: '#media-manager',
    api: {
        baseUrl: 'https://server.com/api/',
        listUrl: 'list'
    },
    multipleSelection: false,
    input: '#file-input'
});
```

## Usage in a VueJS project

**Vue**
```html
<vue-media-manager :opts="options"></vue-media-manager>
```

```javascript
var api = {
    baseUrl: 'https://server.com/api/',
    listUrl: 'list'
};

this.options = {
    api: api,
    multipleSelection: true,
    onSelect: function ({selected}) {
        console.log(selected)
    }
}
```

## Options

### `el`

- Type : String
- Details : CSS selector string. Only in pure JavaScript.

### `basePath`

- Type : String
- Default : ""
- Details : Base path with a trailing slash, e.g. "folder/".

### `api`

- Type : Object
- Details : API Config.

#### `api.baseUrl`

- Type : String
- Default : null

#### `api.listUrl`

- Type : String
- Default : null

#### `api.downloadUrl`

- Type : String
- Default : null

#### `api.uploadUrl`

- Type : String
- Default : null

#### `api.requestConfig`

- Type : Object or Function
- Default : null
- Details : Will be used on each request to override the config passed to axios.

#### `api.axiosOptions`

- Type : Object
- Default : {}
- Details : Will be used to create an [axios instance](https://github.com/mzabriskie/axios#creating-an-instance).

### `input`

- Type : String
- Details : CSS selector string.
- Default : empty string

### `multipleSelection`

- Type : Boolean
- Default : false

### `selected`

- Type : String|array
- Details : Selected medias.

### `onSelect(event)`

- Type : function
- Details : Select callback, use `event.selected` to get selected files.

### `showBreadcrumb`

- Type : Boolean
- Default : true

### `height`

- Type : String
- Default : null
- Details : Use this if you want a fixed height, e.g. '600px'.
