# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/xenial64"

# Yeoman server
  config.vm.network :forwarded_port, guest: 3501, host: 3501

# Guard listen
  config.vm.network :forwarded_port, guest: 4000, host: 4000

  config.vm.provider "virtualbox" do |vb|
    vb.memory = 4096
    vb.cpus = 2
  end

  config.vm.provision "shell", privileged: false do |s|
    s.inline = <<-SHELL
      # Set timezone
      sudo timedatectl set-timezone Europe/Budapest

      # Install dependencies
      sudo apt-get update
      sudo apt-get --no-install-recommends -y install autoconf bison build-essential libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm3 libgdbm-dev phantomjs libjpeg-turbo-progs libjpeg-turbo8 optipng python

      # Install nvm
      curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
      export NVM_DIR="$HOME/.nvm"
      [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

      # Install nodejs
      nvm install 0.8
      nvm alias default 0.8
      nvm use 0.8

      # Install npm and yeoman
      npm install -g npm@2
      npm install -g git://github.com/menthainternet/yeoman-cli.git

      # Install rbenv
      git clone https://github.com/rbenv/rbenv.git ~/.rbenv
      git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
      echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
      echo 'eval "$(rbenv init -)"' >> ~/.bashrc
      export PATH="$HOME/.rbenv/bin:$PATH"
      eval "$(rbenv init -)"

      # Install ruby
      rbenv install 2.3.1
      rbenv global 2.3.1

      # Install compass and bundler
      gem update --system
      gem install compass --version 1.0.1
      gem install bundler
      rbenv rehash

      # Check config
      curl -L https://raw.githubusercontent.com/menthainternet/yeoman/mentha/setup/install.sh | bash

      # Add aliases
      echo 'alias b="yeoman build"' >> ~/.bashrc
      echo 'alias s="yeoman server"' >> ~/.bashrc
      echo 'alias g="bundle exec guard -o 10.0.2.2:4000 -i"' >> ~/.bashrc

      # Change to vagrant folder on login
      echo "cd /vagrant" >> ~/.bashrc

      # Install project dependencies
      cd /vagrant
      npm install
      bundle install --with guard
    SHELL
  end
end
