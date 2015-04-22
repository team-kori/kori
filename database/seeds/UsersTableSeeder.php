<?php namespace LittleNinja\Database\Seeds;

use Illuminate\Database\Seeder;
use Laracasts\TestDummy\Factory as TestDummy;

class UsersTableSeeder extends Seeder
{

    public function run()
    {
        TestDummy::times(20)->create('Kori\User');
    }
}
