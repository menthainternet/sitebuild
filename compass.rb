# auto load Compass plugins
require 'rubygems'
require 'bundler/setup'
Bundler.require(:compass_plugins)

# Compass config
sass_dir = 'app/styles'
css_dir = 'temp/styles'
http_stylesheets_path = '/styles'

images_dir = 'app/images'
http_images_path = '/images'

generated_images_dir = 'temp/images'
http_generated_images_path = '/images'

javascripts_dir = 'app/scripts'
http_javascripts_path = '/scripts'

fonts_dir = 'app/fonts'
http_fonts_path = '/fonts'
