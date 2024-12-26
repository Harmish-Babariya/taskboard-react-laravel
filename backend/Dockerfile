FROM php:8.0-fpm

RUN apt-get update && apt-get install -y libpq-dev git && docker-php-ext-install pdo pdo_pgsql

WORKDIR /var/www

COPY . .

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN composer install

RUN php artisan key:generate

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
