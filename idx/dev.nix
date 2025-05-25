{ pkgs }:
{
  packages = with pkgs; [
    bun
  ];
  shellHook = ''
    bun install
    bun run dev
  '';
}
