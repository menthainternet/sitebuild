# Sitebuild

## Yeoman install

```
npm install -g git://github.com/menthainternet/yeoman-cli.git
```

- [OS X, Linux](https://github.com/yeoman/yeoman/wiki/Installation) (`curl -L https://raw.githubusercontent.com/menthainternet/yeoman/mentha/setup/install.sh | bash`)
- [Windows](http://decodize.com/css/installing-yeoman-front-end-development-stack-windows/)
- [Windows issues](https://github.com/yeoman/yeoman/issues/216)

## Install

Checkout vagy yeoman init (ha majd kész lesz a generátor).

### Post install

```
$ bundle install
$ npm install
```

`composer.json`-ban át kell írni a projekt nevét (`project-name` és `Project name`)

### Fejlesztés könyvtár kiszolgálása

```
$ yeoman server
```

### Build

```
$ yeoman build
```

### Build könyvtár kiszolgálása

```
$ yeoman server:dist
```

### Projectbe ágyazott sitebuild kiszolgálása

```
$ yeoman server:prj
```

Használat közben folyamatosan másol mindent a `dist` könyvárba is, erre például Symfony projecten belül van szükség.

## Konfig

- `composer.json`: [Composer konfig](https://getcomposer.org/)
- `package.json`: [npm és Node.js konfig](http://package.json.nodejitsu.com/) ([Grunt](http://gruntjs.com/) taskok függőségei)
- `Gruntfile.js`: [Grunt taskok](https://github.com/gruntjs/grunt/wiki/Getting-started)
- `Gemfile`, `Gemfile.lock`: [Bundler konfig](http://gembundler.com/#getting-started) ([Compass](http://compass-style.org/) és [pluginjei](http://compass-style.org/frameworks/))
- `compass.rb`: [Compass konfig](http://compass-style.org/help/tutorials/configuration-reference/)
- `.editorconfig`: [EditorConfig](http://editorconfig.org/) ([Sublime Text 2 plugin](https://github.com/sindresorhus/editorconfig-sublime#readme))

## `app/components`

Ide kerülnek a package-nek tekinthető third party összetevők.

A package-ben előre tömörített `.js` és `.css` fájlok legyenek. *

_* egyelőre pont az ellenkezője igaz: [https://github.com/yeoman/grunt-usemin/pull/24]_

Könyvtár név: [package név]-[verzió]

- `app/components/compass_twitter_bootstrap-2.3.2`: [Compass Twitter Bootstrap](https://github.com/vwall/compass-twitter-bootstrap) assetek
- `app/components/css3pie-1.0.0`: [CSS3 PIE](http://css3pie.com/) stable
- `app/components/css3pie-2.0beta1`: [CSS3 PIE](http://css3pie.com/) beta
- `app/components/html5-boilerplate-4.3.0`: [HTML5 Boilerplate](https://github.com/h5bp/html5-boilerplate) assetek
- `app/components/iconic-4af32d470e`: [Iconic](http://www.somerandomdude.com/work/iconic/)
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

Compass import, így mindenhol elérhető.

Ugyanitt a következő Compass plugineket importáljuk:

- [HTML5 Boilerplate](https://github.com/sporkd/compass-h5bp)
- [Font Stacks](https://github.com/adamstac/font-stacks) (opcionális)
- [960 Grid System](https://github.com/nextmat/compass-960-plugin) (opcionális)
- [Susy](https://github.com/ericam/susy) (opcionális)

Mixinek:

- `css3pie`: [CSS3 PIE](http://css3pie.com/), választható stable és beta verziók

#### `app/styles/shared/lib/_helpers.scss`

[H5BP helper classok](https://github.com/h5bp/html5-boilerplate/blob/master/doc/css.md#common-helpers) `h-` (`ir`, `clearfix`) és `is-` (`hidden`, `visuallyhidden`, `invisible`) namespace alatt.

#### `app/styles/frontend/main.scss`

Frontend stylesheet template SMACSS támogatással.

A stylesheet karakter kódolása UTF-8.

`shared` és `frontend` definíció importok után helyi plugin importok és definíciók.

[H5BP normalize.css](https://github.com/h5bp/html5-boilerplate/blob/master/doc/css.md#normalizecss) include

[H5BP print styles](https://github.com/h5bp/html5-boilerplate/blob/master/doc/css.md#print-styles) include (opcionális)

[Compass Twitter Bootstrap](https://github.com/vwall/compass-twitter-bootstrap) import. Alap, reszponzív és Font Awesome verziók, melyekből csak egyet kell választani. (opcionális)

[Iconic](http://www.somerandomdude.com/work/iconic/) import. Használat: `@include iconic(lightbulb);`. (opcionális)

Sprite import példa kód.

##### SMACSS szerinti bontás

- `app/styles/frontend/main/base.scss` - base class-ok, [H5BP defaults](https://github.com/h5bp/html5-boilerplate/blob/master/doc/css.md#html5-boilerplate-defaults) include (Chrome Frame prompt kivételével, opcionális)
- `app/styles/frontend/main/layout.scss` - layout class-ok `l-` namespace alatt
- `app/styles/frontend/main/modules/[moduleName].scss` - modul class-ok a modulok neveivel megegyező nevű fájlokban
- `app/styles/frontend/main/state.scss` - state class-ok `is-` namespace alatt

Végül `shared` és `frontend` helperek betöltése, saját helperek definiálása.

#####Class nevek struktúrája:

`[classCategory-]className[-childName][--modifierName]`

######Layout példák

- `l-layoutName`
- `l-layoutName--modifierName`

######Modul példák

- `modulName`
- `modulName-childName`
- `modulName--modifierName`
- `modulName-childName--modifierName`
- `modulName-childName-childName`

######State példa

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

- deployment
- yeoman generator
