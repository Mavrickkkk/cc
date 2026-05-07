use surrealdb::Surreal;
use surrealdb::engine::remote::ws::{Client, Ws};
use surrealdb::Error;
use std::env;

pub type Db = Surreal<Client>;

pub async fn connect() -> Result<Db, Error> {
    let host = env::var("SURREAL_HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let port = env::var("SURREAL_PORT").unwrap_or_else(|_| "8000".to_string());
    let user = env::var("SURREAL_USER").unwrap_or_else(|_| "root".to_string());
    let pass = env::var("SURREAL_PASS").unwrap_or_else(|_| "root".to_string());
    let ns = env::var("SURREAL_NS").unwrap_or_else(|_| "back".to_string());
    let db_name = env::var("SURREAL_DB").unwrap_or_else(|_| "cc".to_string());

    let url = format!("{}:{}", host, port);

    let db = Surreal::new::<Ws>(&url).await?;

    db.signin(surrealdb::opt::auth::Root {
        username: user,
        password: pass,
    }).await?;

    db.use_ns(&ns).use_db(&db_name).await?;

    Ok(db)
}