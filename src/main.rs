use tokio::{runtime::Id, select};
use warp::{filters::path::param, reply::{Reply, Response}, Filter};
use std::{fs, process::Output};
use regex::Regex;
use dotenvy::dotenv;

mod request;
use request::RequestBuilder;

#[derive(serde::Deserialize)]
struct noveny{
    id: i16,
    neve: String,
    latinneve: String,
    nemszeret: Vec<i16>
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    let port = 4040;
    println!("running on {}", port);
    let mut novenyek: Vec<noveny> = vec![];
    let home = warp::path::end().map(|| warp::reply::html(fs::read_to_string("html/index.html").unwrap()));

    novenyek = RequestBuilder::new().url("https://qrugmxvevfhnipzirkdy.supabase.co/rest/v1")
        .table("faj").select("*").run_struct().unwrap();

    println!("{}", RequestBuilder::new().table("faj").select("id").run_str().unwrap().join(" "));
    let routes = home;
    warp::serve(routes).run(([0,0,0,0], port)).await;
}

