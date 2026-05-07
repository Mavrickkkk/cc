mod db;

use axum::{
    extract::{ConnectInfo, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use chrono::Utc;
use db::Db;

#[derive(Serialize, Deserialize)]
struct TrackingRequest {
    user_agent: Option<String>,
    page: Option<String>,
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    let database = db::connect().await.expect("Erreur connexion DB");
    println!("Connecté à SurrealDB !");

    let app = Router::new()
        .route("/health", get(health))
        .route("/api/track", post(track))
        .layer(CorsLayer::permissive())
        .with_state(database)
        .into_make_service_with_connect_info::<SocketAddr>();

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .expect("Impossible de se lier au port 3000");

    println!("Serveur démarré sur http://127.0.0.1:3000");
    println!("POST /api/track - Enregistrer une visite");

    axum::serve(listener, app).await.expect("Erreur serveur");
}

async fn health() -> impl IntoResponse {
    Json(json!({"status": "ok"}))
}

async fn track(
    State(db): State<Db>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    Json(payload): Json<TrackingRequest>,
) -> impl IntoResponse {
    let page = payload.page.unwrap_or_else(|| "unknown".to_string());
    let user_agent = payload.user_agent.unwrap_or_else(|| "unknown".to_string());
    let ip = addr.ip().to_string();

    match db.query("INSERT INTO visit (page, ip, user_agent, date) VALUES ($page, $ip, $user_agent, $date)")
        .bind(("page", page))
        .bind(("ip", ip))
        .bind(("user_agent", user_agent))
        .bind(("date", Utc::now().to_rfc3339()))
        .await {
        Ok(_) => (StatusCode::CREATED, Json(json!({"ok": true}))),
        Err(e) => {
            eprintln!("Erreur insertion: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"ok": false})))
        }
    }
}
