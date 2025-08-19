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

    - node product/by-uri/generate-file/index.js [[ML_URI]]

EXAMPLE : node product/by-uri/generate-file/index.js https://www.mercadolivre.com.br/premierpet-premier-super-premium-racas-especificas-shih-tzu-co-adulto-pequena-frango-75-kg-sacola-seca-unidade-1/p/MLB12017777

That execution will make a file on product/by-uri/generate-file/output:
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


## Payload Example

    {
    "id": "MLB12017777",
    "url": "https://www.mercadolivre.com.br/alimento-premier-super-premium-racas-especificas-shih-tzu-para-co-adulto-de-raza-pequena-sabor-frango-de-75-kg/p/MLB12017777?product_trigger_id=MLB12017777&picker=true",
    "title": "Alimento Premier Super Premium Raças Específicas Shih Tzu para cão adulto de raza pequena sabor frango de 7.5 kg",
    "price": {
        "current": "199",
        "currency": "R$"
    },
    "description": {
        "text": "Premier Raças Específicas proporciona nutrição específica para cada raça, respeitando as suas particularidades, necessidades de cuidados especiais, desde a formulação balanceada e o tamanho do grão, até defesas às doenças mais comuns que acometem cada uma delas. Desenvolvida com matérias-primas de alta qualidade, tecnologia e inovação, oferecem benefícios exclusivos para a saúde e longevidade. Preparada com ingredientes nobres, contribue para a redução do volume e odor de fezes e oferece benefícios exclusivos que visam minimizar os principais problemas de saúde das raças e auxiliar para o pleno desenvolvimento de suas características típicas desejáveis.\nNutrição específica\nFormato especial do grão que facilita a preensão por cães braquicefálicos, pelagem bonita e pele saudável através de ácidos graxos essenciais ômegas 3 e 6, biotina e zinco.\n\nSaúde intestinal\nAtravés da combinação de ingredientes de alta digestibilidade, fibras especiais e prebiótico.\n\nSaúde oral\nContém hexametafosfato de sódio, importante ingrediente para a prevenção da formação do cálculo dental.\n\nOdor e volume das fezes reduzidos\nSeleção de ingredientes especiais que auxiliam na redução do odor das fezes.\n\nIngredientes\nFarinha de vísceras de frango, glúten de trigo, proteína isolada de suíno, ovo desidratado, quirera de arroz, gordura de frango, gordura suína, óleo de peixe, polpa de beterraba, ácido propiônico, antioxidantes BHA e BHT (0,012%), cloreto de potássio, cloreto de sódio, extrato de yucca (0,06%), hexametafosfato de sódio (0,1%), hidrolisado de suíno e frango, levedura seca de cervejaria, mananoligossacarídeos (0,2%), parede celular de levedura, sulfato de condroitina, sulfato de glicosamina, vitamina A, vitamina B12, vitamina C, vitamina D3, vitamina E, vitamina K3, ácido fólico, ácido pantotênico, biotina, cloreto de colina, niacina, piridoxina, riboflavina, tiamina, cobre aminoácido quelato, ferro aminoácido quelato, iodeto de potássio, manganês aminoácido quelato, proteinato de selênio, sulfato de cobre, sulfato de ferro, sulfato de manganês, sulfato de zinco, zinco aminoácido quelato.\n",
        "html": "Premier Raças Específicas proporciona nutrição específica para cada raça, respeitando as suas particularidades, necessidades de cuidados especiais, desde a formulação balanceada e o tamanho do grão, até defesas às doenças mais comuns que acometem cada uma delas. Desenvolvida com matérias-primas de alta qualidade, tecnologia e inovação, oferecem benefícios exclusivos para a saúde e longevidade. Preparada com ingredientes nobres, contribue para a redução do volume e odor de fezes e oferece benefícios exclusivos que visam minimizar os principais problemas de saúde das raças e auxiliar para o pleno desenvolvimento de suas características típicas desejáveis.<br>Nutrição específica<br>Formato especial do grão que facilita a preensão por cães braquicefálicos, pelagem bonita e pele saudável através de ácidos graxos essenciais ômegas 3 e 6, biotina e zinco.<br><br>Saúde intestinal<br>Através da combinação de ingredientes de alta digestibilidade, fibras especiais e prebiótico.<br><br>Saúde oral<br>Contém hexametafosfato de sódio, importante ingrediente para a prevenção da formação do cálculo dental.<br><br>Odor e volume das fezes reduzidos<br>Seleção de ingredientes especiais que auxiliam na redução do odor das fezes.<br><br>Ingredientes<br>Farinha de vísceras de frango, glúten de trigo, proteína isolada de suíno, ovo desidratado, quirera de arroz, gordura de frango, gordura suína, óleo de peixe, polpa de beterraba, ácido propiônico, antioxidantes BHA e BHT (0,012%), cloreto de potássio, cloreto de sódio, extrato de yucca (0,06%), hexametafosfato de sódio (0,1%), hidrolisado de suíno e frango, levedura seca de cervejaria, mananoligossacarídeos (0,2%), parede celular de levedura, sulfato de condroitina, sulfato de glicosamina, vitamina A, vitamina B12, vitamina C, vitamina D3, vitamina E, vitamina K3, ácido fólico, ácido pantotênico, biotina, cloreto de colina, niacina, piridoxina, riboflavina, tiamina, cobre aminoácido quelato, ferro aminoácido quelato, iodeto de potássio, manganês aminoácido quelato, proteinato de selênio, sulfato de cobre, sulfato de ferro, sulfato de manganês, sulfato de zinco, zinco aminoácido quelato.<br>"
    },
    "specifications": [
        {
        "title": "Características principais",
        "rows": [
            {
            "label": "Fabricante",
            "value": "PremieRpet"
            },
            {
            "label": "Marca",
            "value": "Premier"
            },
            {
            "label": "Linha",
            "value": "Super Premium"
            },
            {
            "label": "Nome",
            "value": "Raças Específicas Shih Tzu"
            },
            {
            "label": "Formato de venda",
            "value": "Unidade"
            }
        ]
        },
        {
        "title": "Outros",
        "rows": [
            {
            "label": "Porcentagem de proteína bruta",
            "value": "25 %"
            },
            {
            "label": "Necessidades especiais",
            "value": "Diabetes"
            },
            {
            "label": "Fornecimento de nutrientes",
            "value": "10% umidade, 7% minerais, 3.5% Fibra bruta, 1.3% Cálcio, Conteúdo calórico 4.003 kcal/kg"
            }
        ]
        },
        {
        "title": "Características do animal de estimação",
        "rows": [
            {
            "label": "Animal de estimação recomendado",
            "value": "Cão"
            },
            {
            "label": "Etapa de vida do animal",
            "value": "Adulto"
            },
            {
            "label": "Tamanho da raça",
            "value": "Pequena"
            }
        ]
        },
        {
        "title": "Especificações",
        "rows": [
            {
            "label": "Sabor",
            "value": "Frango"
            },
            {
            "label": "Peso da unidade",
            "value": "7,5 kg"
            },
            {
            "label": "Tipo de comida para animais",
            "value": "Seca"
            },
            {
            "label": "É protetor da saúde bucal",
            "value": "Sim"
            },
            {
            "label": "Ingredientes",
            "value": "Farinha de vísceras de frango, Glúten de trigo, Ovo desidratado, Arroz partido, Gordura de frango, Gordura de porco, Óleo de peixe, Polpa de beterraba, Ácido propiónico, BHA, BHT, Cloreto de potássio, Cloreto de sódio, Extrato de yucca, Hexametafosfato de sódio, Frango hidrolisado, Hidrolisado de cerdo, Levedura de cerveja seca, Mananoligossacarídeos, Pared celular de levedura, Sulfato de condroitina, Sulfato de glucosamina, Vitamina A, Vitamina B12, Vitamina C, Vitamina D3, Vitamina E, Vitamina K3, Ácido fólico, Vitamina B5, Biotina, Cloreto de colina, Niacina, Piridoxina, Riboflavina, Tiamina, Quelato de aminoácido de cobre, Quelato de aminoácido de ferro, Iodeto de potássio, Manganês aminoácido quelato, Proteinato de selénio, Sulfato de cobre, Sulfato de ferro, Sulfato de manganês, Sulfato de zinco, Quelato de zinco"
            }
        ]
        }
    ],
    "images": [
        {
        "thumbnail": "https://http2.mlstatic.com/D_Q_NP_957990-MLA82148366394_022025-R.webp",
        "mid_size": "https://http2.mlstatic.com/D_NQ_NP_957990-MLA82148366394_022025-O.webp",
        "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_957990-MLA82148366394_022025-F.webp"
        },
        {
        "thumbnail": "https://http2.mlstatic.com/D_Q_NP_829454-MLA82431266099_022025-R.webp",
        "mid_size": "https://http2.mlstatic.com/D_NQ_NP_829454-MLA82431266099_022025-O.webp",
        "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_829454-MLA82431266099_022025-F.webp"
        },
        {
        "thumbnail": "https://http2.mlstatic.com/D_Q_NP_784182-MLA82148338760_022025-R.webp",
        "mid_size": "https://http2.mlstatic.com/D_NQ_NP_784182-MLA82148338760_022025-O.webp",
        "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_784182-MLA82148338760_022025-F.webp"
        },
        {
        "thumbnail": "https://http2.mlstatic.com/D_Q_NP_753275-MLA82148280374_022025-R.webp",
        "mid_size": "https://http2.mlstatic.com/D_NQ_NP_753275-MLA82148280374_022025-O.webp",
        "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_753275-MLA82148280374_022025-F.webp"
        },
        {
        "thumbnail": "https://http2.mlstatic.com/D_Q_NP_753232-MLA40427352099_012020-R.webp",
        "mid_size": "https://http2.mlstatic.com/D_NQ_NP_753232-MLA40427352099_012020-O.webp",
        "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_753232-MLA40427352099_012020-F.webp"
        },
        {
        "thumbnail": "https://http2.mlstatic.com/D_Q_NP_669318-MLA79909716065_102024-R.webp",
        "mid_size": "https://http2.mlstatic.com/D_NQ_NP_669318-MLA79909716065_102024-O.webp",
        "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_669318-MLA79909716065_102024-F.webp"
        }
    ],
    "variations": [
        {
        "attributes": [
            [
            {
                "label": "Sabor"
            },
            {
                "value": "Frango"
            }
            ],
            [
            {
                "label": "Peso da unidade"
            },
            {
                "value": "1 kg"
            }
            ]
        ],
        "title": "Ração Premier shih tzu adultos frango raças específicas 1 kg",
        "price": {
            "current": "44.99",
            "currency": "R$"
        },
        "images": [
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_799523-MLU78123670575_082024-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_799523-MLU78123670575_082024-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_799523-MLU78123670575_082024-F.webp"
            },
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_926314-MLU75873128442_042024-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_926314-MLU75873128442_042024-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_926314-MLU75873128442_042024-F.webp"
            },
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_998100-MLU72576581536_112023-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_998100-MLU72576581536_112023-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_998100-MLU72576581536_112023-F.webp"
            }
        ],
        "available": true
        },
        {
        "attributes": [
            [
            {
                "label": "Sabor"
            },
            {
                "value": "Frango"
            }
            ],
            [
            {
                "label": "Peso da unidade"
            },
            {
                "value": "2.5 kg"
            }
            ]
        ],
        "title": "Ração Premier Raças Específicas Shih Tzu Adulto 2,5 Kg Frang",
        "price": {
            "current": "92.12",
            "currency": "R$"
        },
        "images": [
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_646794-MLA40427352103_012020-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_646794-MLA40427352103_012020-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_646794-MLA40427352103_012020-F.webp"
            },
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_660283-MLU73673343449_122023-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_660283-MLU73673343449_122023-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_660283-MLU73673343449_122023-F.webp"
            },
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_670702-MLA89953584501_082025-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_670702-MLA89953584501_082025-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_670702-MLA89953584501_082025-F.webp"
            }
        ],
        "available": true
        },
        {
        "attributes": [
            [
            {
                "label": "Sabor"
            },
            {
                "value": "Frango"
            }
            ],
            [
            {
                "label": "Peso da unidade"
            },
            {
                "value": "7.5 kg"
            }
            ]
        ],
        "title": "Alimento Premier Super Premium Raças Específicas Shih Tzu para cão adulto de raza pequena sabor frango de 7.5 kg",
        "price": {
            "current": "199",
            "currency": "R$"
        },
        "images": [
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_957990-MLA82148366394_022025-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_957990-MLA82148366394_022025-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_957990-MLA82148366394_022025-F.webp"
            },
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_829454-MLA82431266099_022025-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_829454-MLA82431266099_022025-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_829454-MLA82431266099_022025-F.webp"
            },
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_784182-MLA82148338760_022025-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_784182-MLA82148338760_022025-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_784182-MLA82148338760_022025-F.webp"
            },
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_753275-MLA82148280374_022025-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_753275-MLA82148280374_022025-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_753275-MLA82148280374_022025-F.webp"
            },
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_753232-MLA40427352099_012020-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_753232-MLA40427352099_012020-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_753232-MLA40427352099_012020-F.webp"
            },
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_669318-MLA79909716065_102024-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_669318-MLA79909716065_102024-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_669318-MLA79909716065_102024-F.webp"
            }
        ],
        "available": true
        },
        {
        "attributes": [
            [
            {
                "label": "Sabor"
            },
            {
                "value": "Salmão"
            }
            ],
            [
            {
                "label": "Peso da unidade"
            },
            {
                "value": "1 kg"
            }
            ]
        ],
        "title": "Ração Premier shih tzu adultos frango raças específicas 1 kg",
        "price": {
            "current": "44.99",
            "currency": "R$"
        },
        "images": [
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_799523-MLU78123670575_082024-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_799523-MLU78123670575_082024-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_799523-MLU78123670575_082024-F.webp"
            },
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_926314-MLU75873128442_042024-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_926314-MLU75873128442_042024-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_926314-MLU75873128442_042024-F.webp"
            },
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_998100-MLU72576581536_112023-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_998100-MLU72576581536_112023-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_998100-MLU72576581536_112023-F.webp"
            }
        ],
        "available": true
        },
        {
        "attributes": [
            [
            {
                "label": "Sabor"
            },
            {
                "value": "Salmão"
            }
            ],
            [
            {
                "label": "Peso da unidade"
            },
            {
                "value": "2.5 kg"
            }
            ]
        ],
        "title": "Ração Premier Raças Específicas Shih Tzu Adulto 2,5 Kg Frang",
        "price": {
            "current": "92.12",
            "currency": "R$"
        },
        "images": [
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_646794-MLA40427352103_012020-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_646794-MLA40427352103_012020-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_646794-MLA40427352103_012020-F.webp"
            },
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_660283-MLU73673343449_122023-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_660283-MLU73673343449_122023-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_660283-MLU73673343449_122023-F.webp"
            },
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_670702-MLA89953584501_082025-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_670702-MLA89953584501_082025-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_670702-MLA89953584501_082025-F.webp"
            }
        ],
        "available": true
        },
        {
        "attributes": [
            [
            {
                "label": "Sabor"
            },
            {
                "value": "Salmão"
            }
            ],
            [
            {
                "label": "Peso da unidade"
            },
            {
                "value": "7.5 kg"
            }
            ]
        ],
        "title": "Alimento Premier Super Premium Raças Específicas Shih Tzu para cão adulto de raza pequena sabor frango de 7.5 kg",
        "price": {
            "current": "199",
            "currency": "R$"
        },
        "images": [
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_957990-MLA82148366394_022025-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_957990-MLA82148366394_022025-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_957990-MLA82148366394_022025-F.webp"
            },
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_829454-MLA82431266099_022025-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_829454-MLA82431266099_022025-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_829454-MLA82431266099_022025-F.webp"
            },
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_784182-MLA82148338760_022025-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_784182-MLA82148338760_022025-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_784182-MLA82148338760_022025-F.webp"
            },
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_753275-MLA82148280374_022025-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_753275-MLA82148280374_022025-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_753275-MLA82148280374_022025-F.webp"
            },
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_753232-MLA40427352099_012020-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_753232-MLA40427352099_012020-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_753232-MLA40427352099_012020-F.webp"
            },
            {
            "thumbnail": "https://http2.mlstatic.com/D_Q_NP_669318-MLA79909716065_102024-R.webp",
            "mid_size": "https://http2.mlstatic.com/D_NQ_NP_669318-MLA79909716065_102024-O.webp",
            "full_size": "https://http2.mlstatic.com/D_NQ_NP_2X_669318-MLA79909716065_102024-F.webp"
            }
        ],
        "available": true
        }
    ],
    "metadata": {
        "extracted_at": "2025-08-19T02:22:45.011Z",
        "source": "Mercado Livre"
    }
    }



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