set -e

echo "🔧 Configuration du serveur..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
echo "📦 Installation de Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Rust
echo "🦀 Installation de Rust..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"

# Install SurrealDB
echo "🗄️  Installation de SurrealDB..."
curl --proto '=https' --tlsv1.2 -sSf https://install.surrealdb.com | sh

# Create data directory
mkdir -p ./data

echo "✅ Installation terminée !"
echo "Lancez: make -f Makefile.prod run"
