ignore %r{^\.git/}, %r{^\.sass-cache/}, %r{^\.vagrant/}, %r{^node_modules/}, %r{^temp/}, %r{^.+\.log}

change_script = {
  run_on_additions: proc { system("touch app/scripts/.guardchange") },
  run_on_modifications: proc { system("touch app/scripts/.guardchange") },
  run_on_removals: proc { system("touch app/scripts/.guardchange") },
}

guard :yield, change_script do
  watch(%r{^../app/scripts/.+\.coffee})
end

change_style = {
  run_on_additions: proc { system("touch app/styles/.guardchange") },
  run_on_modifications: proc { system("touch app/styles/.guardchange") },
  run_on_removals: proc { system("touch app/styles/.guardchange") },
}

guard :yield, change_style do
  watch(%r{^../app/styles/.+\.(scss|sass)})
end

change_template = {
  run_on_additions: proc { system("touch app/templates/.guardchange") },
  run_on_modifications: proc { system("touch app/templates/.guardchange") },
  run_on_removals: proc { system("touch app/templates/.guardchange") },
}

guard :yield, change_template do
  watch(%r{^../app/templates/.+})
end

change_other = {
  run_on_additions: proc { system("touch app/.guardchange") },
  run_on_modifications: proc { system("touch app/.guardchange") },
  run_on_removals: proc { system("touch app/.guardchange") },
}

guard :yield, change_other do
  watch(%r{^../app/scripts/.+\.js})
  watch(%r{^../app/styles/.+\.css})
  watch(%r{^../app/images/.+\.(gif|jpg|png)})
  watch(%r{^../app/fonts/.+})
  watch(%r{^../app/multimedia/.+})
end
