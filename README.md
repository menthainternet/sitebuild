# install

Install nodejs:
$ nvm install 6.9.1

Using:
$ nvm use 6.9.1

# project install
Install packages:
$ npm install

# Develop
$ gulp watch

# Build project
$ gulp build


# Features

- sass (libsass)
- ect (templating)
- autoprefixer (css vendor prefix)
- useref (parsing html blocks on build and concat js and css)
- cssnano (minifying css)
- uglify (minifying js)
- html beautifyer (beatutify html)


# Sitebuild

### Post install

`composer.json`-ban át kell írni a projekt nevét (`project-name` és `Project name`)

## Konfig

- `composer.json`: [Composer konfig](https://getcomposer.org/)
- `package.json`: [npm és Node.js konfig](http://package.json.nodejitsu.com/) ([Grunt](http://gruntjs.com/) taskok függőségei)
- `gulpfile.js`: [gulp taskok](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
- `.editorconfig`: [EditorConfig](http://editorconfig.org/) ([Sublime Text 2 plugin](https://github.com/sindresorhus/editorconfig-sublime#readme))

## `app/components`

Ide kerülnek a package-nek tekinthető third party összetevők.

Könyvtár név: [package név]-[verzió]

- `app/components/jquery-1.8.3`: jQuery ([release notes](http://blog.jquery.com/2012/11/13/jquery-1-8-3-released/))
- `app/components/jquery-1.9.1`: jQuery ([release notes](http://blog.jquery.com/2013/02/04/jquery-1-9-1-released/))
- `app/components/jquery-1.11.1`: jQuery ([release notes](http://blog.jquery.com/2014/05/01/jquery-1-11-1-and-2-1-1-released/))
- `app/components/jquery-placeholder-2.0.7`: [HTML5 Placeholder jQuery Plugin](https://github.com/mathiasbynens/jquery-placeholder)
- `app/components/jquery-ui-1.10.0`: jQuery UI [release notes](http://blog.jqueryui.com/2013/01/jquery-ui-1-10-0/)
- `app/components/modernizr-2.6.2`: [Modernizr](http://modernizr.com/) custom build
- `app/components/selectivizr-1.0.2`: [Selectivizr](http://selectivizr.com)

## Asset könyvtárak

Minden könyvtár alatt a következő bontás található:

- `backend`
- `frontend`
- `shared`
- `sitebuild`

A `shared` alá mennek az alkalmazások által közösen használt assetek, minden más a megfelelő alkalmazás könyvtárába kerül.

### `app/fonts`

Fontok helye.

### `app/images`

Képek helye.

### `app/multimedia`

Multimédia alkalmazások helye (pl. Flash, Silverlight).

### `app/scripts`

Saját szkriptek helye. `.coffee` fájlok lefordulnak JavaScriptre.

`app/scripts/frontend` alatt jQuery DOM ready template található JavaScriptben (`main.js`) és CoffeeScriptben (`main.coffee`).
Amelyik nem kell, az törölhető.

### `app/styles`

Saját stylesheetek helye.

`.scss` és `.sass` fájlok lefordulnak CSS-re.

Minden alkalmazás könyvtára alatt található egy `lib` könyvtár, benne a következő fájlokkal:

- `_definitions.scss`: pluginek betöltése, változók és mixinek definíciói
- `_helpers.scss`: utility-, state- és helper class-ok

Alkalmazás stylesheetekben a következő az import hierarchia:

- `shared/lib`
- `[alkalmazás]/lib`
- helyi definíciók / helperek

A definíciók a stylesheetek elején, a helperek a végén szerepelnek.

#### `app/styles/shared/lib/_definitions.scss`


#### `app/styles/shared/lib/_helpers.scss`

[H5BP helper classok](https://github.com/h5bp/html5-boilerplate/blob/master/doc/css.md#common-helpers) `h-` (`ir`, `clearfix`) és `is-` (`hidden`, `visuallyhidden`, `invisible`) namespace alatt.

#### `app/styles/frontend/main.scss`

Frontend stylesheet template SMACSS támogatással.

A stylesheet karakter kódolása UTF-8.


##### SMACSS szerinti bontás

- `app/styles/frontend/main/base.scss` - base class-ok, [H5BP defaults](https://github.com/h5bp/html5-boilerplate/blob/master/doc/css.md#html5-boilerplate-defaults) include (Chrome Frame prompt kivételével, opcionális)
- `app/styles/frontend/main/layout.scss` - layout class-ok `l-` namespace alatt
- `app/styles/frontend/main/modules/[moduleName].scss` - modul class-ok a modulok neveivel megegyező nevű fájlokban
- `app/styles/frontend/main/state.scss` - state class-ok `is-` namespace alatt

Végül `shared` és `frontend` helperek betöltése, saját helperek definiálása.

##### Class nevek struktúrája:

`[classCategory-]className[-childName][--modifierName]`

###### Layout példák

- `l-layoutName`
- `l-layoutName--modifierName`

###### Modul példák

- `modulName`
- `modulName-childName`
- `modulName--modifierName`
- `modulName-childName--modifierName`
- `modulName-childName-childName`

###### State példa

- `is-stateName`

#### `app/styles/backend/editor.scss`

CKEditor stylesheet template.

A stylesheet karakter kódolása UTF-8.

## `app/templates`

`'`, include sor elején, `.html` nem kell, abszolút hivatkozások, partialök behúzása

## `app/uploads`

## Egyéb fájlok

### `.htaccess`

### `channel_hu_HU.html`

### `crossdomain.xml`

### `favicon.ico`

### `robots.txt`

## Build

### `dist`

### `.gitignore`, `.buildignore`, `.ignore`

## Felhasznált összetevők

## TODO
