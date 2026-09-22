FROM node:22-bookworm-slim AS node
FROM ruby:3.3-bookworm
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx \
    && apt-get update && apt-get install -y --no-install-recommends python3-venv \
    && rm -rf /var/lib/apt/lists/*
RUN python3 -m venv /opt/assets
ENV PATH="/opt/assets/bin:${PATH}"
COPY requirements-assets.txt /tmp/requirements-assets.txt
RUN pip install --no-cache-dir -r /tmp/requirements-assets.txt
WORKDIR /workspace
COPY Gemfile Gemfile.lock ./
RUN gem install bundler:2.4.22 --no-document && bundle _2.4.22_ install
RUN useradd --create-home --uid 1000 developer \
    && mkdir -p /workspace/node_modules && chown -R developer:developer /workspace
USER developer
EXPOSE 4000
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0"]
