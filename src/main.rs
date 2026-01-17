use warp::{filters::path::param, reply::{Reply, Response}, Filter};
use std::fs;
use regex::Regex;

#[tokio::main]
async fn main() {
    let port = 4040;
    println!("running on {}", port);
    let home = warp::path::end().map(|| warp::reply::html(fs::read_to_string("html/index.html").unwrap()));

    let routes = home;
    warp::serve(routes).run(([0,0,0,0], port)).await;
}
