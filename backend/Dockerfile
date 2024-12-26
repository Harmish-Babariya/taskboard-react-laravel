FROM php:8.1-fpm

# Set working directory to /app
WORKDIR /app

# Copy composer.lock and composer.json
COPY composer.lock composer.json ./

# Install any needed packages
RUN apt-get update && apt-get install -y libzip-dev zip

# Install composer dependencies
RUN composer install --no-dev --prefer-dist

# Copy the rest of the application code
COPY . .

# Set environment variables
ENV COMPOSER_HOME=app/composer
ENV COMPOSER_CACHE_DIR=app/composer/cache

# Expose port 9000 for FPM
EXPOSE 9000

# Run command when container launches
CMD ["php", "artisan", "serve", "--host=0.0.0.0"]