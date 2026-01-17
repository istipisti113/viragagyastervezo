use tokio::runtime::Id;
use warp::{filters::path::param, reply::{Reply, Response}, Filter};
use std::{fs, process::Output};
use regex::Regex;
use dotenvy::dotenv;

mod request;
use request::RequestBuilder;

struct noveny{
    id: i16,
    name: String,
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

    println!("{}", RequestBuilder::new().url("https://qrugmxvevfhnipzirkdy.supabase.co/rest/v1")
        .table("faj").param("id=3").run() ) ;

    let routes = home;
    warp::serve(routes).run(([0,0,0,0], port)).await;
}

