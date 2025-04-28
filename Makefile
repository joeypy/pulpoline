# Pulpo Line Makefile

# Variables
COMPOSE=docker-compose

up:
	$(COMPOSE) up -d
	@echo "🟢 Servicios levantados: backend, frontend, db, redis."

down:
	$(COMPOSE) down
	@echo "🛑 Servicios detenidos."

logs:
	$(COMPOSE) logs -f

restart:
	$(COMPOSE) down
	$(COMPOSE) up --build -d
	@echo "🔄 Servicios reconstruidos y levantados."

ps:
	$(COMPOSE) ps

build:
	$(COMPOSE) build
	@echo "🏗️ Build completado."
