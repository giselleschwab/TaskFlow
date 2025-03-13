# Usando a imagem oficial do PHP com Apache
FROM php:8.1-apache

# Instalar as dependências necessárias para as extensões PHP
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libssl-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql mysqli

# Instalar a extensão Redis via PECL
RUN pecl install redis \
    && docker-php-ext-enable redis

# Habilitar mod_rewrite no Apache para URLs amigáveis
RUN a2enmod rewrite

# Configurar o Apache para apontar para a pasta public do backend
RUN echo "<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/public\n\
    <Directory /var/www/html/public>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>" > /etc/apache2/sites-available/000-default.conf

# Expor a porta 80 para acesso ao Apache
EXPOSE 80

# Definir a pasta de trabalho como o diretório backend
WORKDIR /var/www/html/backend

# Copiar o código do seu projeto para o container
COPY . /var/www/html/

# Iniciar o Apache
CMD ["apache2-foreground"]
