# autoload plugins
require "rubygems"
require "bundler/setup"
Bundler.require(:compass_plugins)

# config dirs
css_dir = "styles"
sass_dir = "styles/_sources"
fonts_dir = "fonts"
images_dir = "images"
javascripts_dir = "scripts"

# disable cache for now
cache = false
#cache_dir = "cache/compass"

# compressed output
output_style = :compressed
