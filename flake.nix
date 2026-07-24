{
  description = "Wizard City — shared map-making Express app";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs =
    { self, nixpkgs }:
    let
      systems = [
        "aarch64-darwin"
        "x86_64-darwin"
        "x86_64-linux"
        "aarch64-linux"
      ];
      forEachSystem = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
    in
    {
      devShells = forEachSystem (pkgs: {
        default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs_24
            yarn-berry
            python3
            pkg-config
            gnumake
            sqlite
            turso-cli
          ];

          shellHook = ''
            if [ ! -f .env ]; then
              echo "warning: no .env file — copy .env.example and set DB_URL / DB_AUTH" >&2
            fi
          '';
        };
      });

      # `nix run`
      apps = forEachSystem (pkgs: {
        default = {
          type = "app";
          program = nixpkgs.lib.getExe (
            pkgs.writeShellApplication {
              name = "wizardcity-dev";
              runtimeInputs = with pkgs; [
                nodejs_24
                yarn-berry
                python3
                pkg-config
                gnumake
                stdenv.cc
              ];
              text = ''
                [ -d node_modules ] || yarn install
                exec yarn dev
              '';
            }
          );
        };
      });
    };
}
