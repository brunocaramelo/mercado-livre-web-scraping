# MERCADO LIVRE WEB SCRAPPING

## Technical Specifications

This application has the following specifications: 

| Tool | Version |
| --- | --- |
| Node JS | 22.8.0 |
| NPX | 10.8.2 |


<!-- The application is separated into the following containers

| Service | Image | Motivation
| --- | --- | --- |
| postgres | postgres:15 | Main database |
| php | php-app | Main Application (Web) |
| websocket-server | php-cli | CLI Application running Reverb Websocket |
| web (nginx) and Vue 3 | nginx:alpine | Web Server | -->

## Requirements
<!-- - Docker
- Docker Daemon (Service)
- Docker Compose -->
    - Node JS
    - NPX

## Installation procedures
    Procedures for installing the application for local use

1- Download repository 
    - git clone https://github.com/mercado-livre-web-scraping-/tree/main/mercadolivre-scraper.git
       
        we must run commands below:
    - npx playwright install-deps

<!-- - cp .env.docker-compose.example .env
- cp docker/docker-compose-env/application.env.example docker/docker-compose-env/application.env
- cp docker/docker-compose-env/ws-application.env.example docker/docker-compose-env/ws-application.env
- cp docker/docker-compose-env/database.env.example docker/docker-compose-env/database.env -->

<!-- 2 - Check that the ports:

    - 80 (nginx) 
    
    - 6380 (redis) 
    
    - 9000(php-fpm)

    - 5432(postgres) 
    
    - 8182(websocket) 

     are busy.


3 - Enter the application's home directory and run the following commands:
    
    1 - docker compose up (to see the logs on stdout);

    ### Description of steps (in case of problems)

    1 - for the images to be stored and executed and upload the instances
        
        (NOTE) - due to composer's delay in bringing up the dependencies, there are 3 alternatives,
        
            1 - RUN sudo docker compose up; without being a daemon the first time, so that you can check the progress of the installation of dependencies.
            
            2 - Wait 20 minutes or so for the command to be executed, to avoid autoloading for example.
            
            
    2 - for the framework to generate and apply the mapping for the database (SQL), which can be PostGres or SQLITE.
    
    3 - for the framework to apply changes to the database data, in the case of inserting a first user.
    
    4 - generation of a hash key for use by the system as a validation key.
    
    5 - for the framework to run the test suite.
        - Feature tests  
        - Unit tests
      -->

## Post Installation

Command to Generate Json File Output:

    - nodejs product/by-route/generate-file/index.js [[ML_URI]]

EXAMPLE : nodejs product/by-route/generate-file/index.js https://www.mercadolivre.com.br/premierpet-premier-super-premium-racas-especificas-shih-tzu-co-adulto-pequena-frango-75-kg-sacola-seca-unidade-1/p/MLB12017777

That execution will make a file on product/by-route/generate-file/output:
called : 
 - [[ML_ID]]_product_complete_data.json

    With Informations:

    - id
    - url
    - title
    - price
    - description
    - specifications
    - images
    - variations
    - metadata

## Tecnical Details

    - Node JS 

    - SOLID


<!-- #### Extra

    If you want to run the project locally, just run 

    1 - cp .env.local.example .env
    2 - If you don't have Postgre Running on local or remote : change on .env to DB_HOST=database and run (2.1). Or else, run (2.2) and change DB_* credentials
        2.1 - docker compose up -d cache database
        2.2 - docker compose up -d cache
    3 - composer install
    4 - php artisan reverb:start --debug
    5 - php artisan serve
    6 - npm run dev OR npm run build
    7 - php artisan migrate && php artisan db:seed
    8 - and check out http://localhost:8000
    9 - php artisan test -->