# Base image: Ruby with necessary dependencies for Jekyll
FROM ruby:3.3

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    nodejs \
    && rm -rf /var/lib/apt/lists/*


# Create a non-root user with UID 1000
RUN groupadd -g 1000 vscode && \
    useradd -m -u 1000 -g vscode vscode

# Set the working directory
WORKDIR /usr/src/app

# Set permissions for the working directory
RUN chown -R vscode:vscode /usr/src/app

# Switch to the non-root user
USER vscode

# Copy the locked Ruby dependency definition.
COPY Gemfile Gemfile.lock ./

# Install the lockfile's Bundler version and dependencies.
RUN gem install bundler:2.4.22
RUN bundle _2.4.22_ install

# Command to serve the Jekyll site
CMD ["bundle", "exec", "jekyll", "serve", "-H", "0.0.0.0", "-w"]
