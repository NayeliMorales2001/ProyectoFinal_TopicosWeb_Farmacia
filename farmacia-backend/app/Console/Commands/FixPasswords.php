<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class FixPasswords extends Command
{
    protected $signature = 'users:fix-passwords';
    protected $description = 'Encriptar contraseñas existentes';

    public function handle()
    {
        $users = User::all();

        foreach ($users as $user) {

            // 🔥 Si no está encriptada (no empieza con $2y$)
            if (!str_starts_with($user->password, '$2y$')) {

                $this->info("Encriptando usuario: " . $user->email);

                $user->password = Hash::make($user->password);
                $user->save();
            }
        }

        $this->info("✔ Contraseñas actualizadas correctamente");
    }
}