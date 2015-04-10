<?php

$factory( 'Kori\User', [
    'username' => $faker->userName,
    'email'    => $faker->email,
    'password' => $faker->word
] );
