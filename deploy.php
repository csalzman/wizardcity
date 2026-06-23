<?php
// Path to your repository root on cPanel
$repo_path = '/home/chrisbcx/repositories/wizardcity/';

// Pull latest changes from the main branch
exec("cd {$repo_path} && git pull origin main", $output);

print_r($output);
?>