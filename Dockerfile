FROM ruby:3-alpine

# Minimal requirements to run a Rails app
RUN apk add --no-cache --update build-base \
    linux-headers \
    imagemagick \
    git \
    mariadb-dev \
    nodejs \
    yarn \
    tzdata

ENV APP_PATH /usr/src/app

# Different layer for gems installation
WORKDIR $APP_PATH
ADD Gemfile $APP_PATH
ADD Gemfile.lock $APP_PATH
RUN gem install bundler && \
      gem list bundler
RUN bundle config set --local path '.bundle' && \
      bundle install --verbose --jobs 20 --retry 5

# Copy the application into the container
COPY . .

# Copy entrypoint
COPY entrypoint.sh /usr/bin/entrypoint
RUN chmod +x /usr/bin/entrypoint
ENTRYPOINT ["entrypoint"]

EXPOSE 3000
# Start the main process.
CMD ["rails", "server", "-b", "0.0.0.0"]
