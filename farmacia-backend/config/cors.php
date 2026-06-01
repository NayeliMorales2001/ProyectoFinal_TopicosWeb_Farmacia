<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://proyectofinal-topicosweb-farmacia-1-1lev.onrender.com',
        'https://proyectofinal-topicosweb-farmacia-1.onrender.com',
        'http://localhost:5173'
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];
