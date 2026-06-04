#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
agents_dir="$repo_root/.agents"
source_dir="$agents_dir/skills"
target_dir="$repo_root/.claude/skills"

echo "Linking skills ..."

if [[ -d "$agents_dir" ]]; then
  if [[ -d "$source_dir" ]]; then
    mkdir -p "$target_dir"

    for source_path in "$source_dir"/*; do
      if [[ ! -d "$source_path" ]]; then
        continue
      fi

      skill_name="$(basename "$source_path")"
      target_path="$target_dir/$skill_name"

      if [[ -L "$target_path" ]]; then
        current_target="$(readlink "$target_path")"
        desired_target="$source_path"

        if [[ "$current_target" != "$desired_target" ]]; then
          rm "$target_path"
          ln -s "$desired_target" "$target_path"
        fi

        continue
      fi

      if [[ -e "$target_path" ]]; then
        echo "Refusing to replace non-symlink path: $target_path" >&2
        exit 1
      fi

      ln -s "$source_path" "$target_path"
    done

    echo "Skills linked successfully."
  else
    echo "No skills directory found at $source_dir; skipping skills."
  fi
else
  echo "No .agents directory found; skipping skills."
fi

link_symlink() {
  local target="$1"
  local link_path="$2"
  local label="$3"

  if [[ -L "$link_path" ]]; then
    if [[ "$(readlink "$link_path")" != "$target" ]]; then
      rm "$link_path"
      ln -s "$target" "$link_path"
      echo "$label symlink updated."
    fi
  elif [[ -e "$link_path" ]]; then
    echo "Refusing to replace non-symlink path: $link_path" >&2
    exit 1
  else
    ln -s "$target" "$link_path"
    echo "$label symlinked."
  fi
}

link_agent_guide() {
  local project_dir="$1"
  local agents_path="$project_dir/AGENTS.md"

  if [[ ! -f "$agents_path" || -L "$agents_path" ]]; then
    echo "Expected a regular project guide at: $agents_path" >&2
    exit 1
  fi

  link_symlink "AGENTS.md" "$project_dir/CLAUDE.md" "$project_dir/CLAUDE.md"
}

link_agent_guide "$repo_root"

for project_dir in "$repo_root"/apps/*; do
  if [[ -d "$project_dir" && -f "$project_dir/package.json" ]]; then
    link_agent_guide "$project_dir"
  fi
done
