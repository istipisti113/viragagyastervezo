use tokio::{runtime::Id, select};
use warp::{filters::path::param, reply::{Reply, Response}, Filter};
use std::{fs, process::Output};
use regex::Regex;
use dotenvy::dotenv;

mod request;
use request::RequestBuilder;

#[derive(serde::Deserialize, serde::Serialize, Debug)]
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

    //let novenyek: Vec<noveny> = RequestBuilder::new().url("https://qrugmxvevfhnipzirkdy.supabase.co/rest/v1").table("faj").select("*").run_struct().unwrap();

    //path
    let home = warp::path::end().map(|| warp::reply::html(fs::read_to_string("html/index.html").unwrap()));
    let style = warp::path!("style.css").and(warp::fs::file("html/style.css"));
    let script = warp::path!("script.js").and(warp::fs::file("script.js"));
    let scriptasd = warp::path!("asd.js").and(warp::fs::file("html/asd.js"));
    let background = warp::path!("background.jpg").and(warp::fs::file("images/background.jpg"));
    let novenyek = warp::path!("novenyek").map(||{
        let plants: Vec<noveny> = RequestBuilder::new().url("https://qrugmxvevfhnipzirkdy.supabase.co/rest/v1").table("faj").select("*").run_struct().unwrap();
        warp::reply::json(&serde_json::to_string(&plants).unwrap())
    });


    println!("{}", RequestBuilder::new().table("faj").select("id").run_str().unwrap().join(" "));
    let routes = home
    .or(style).or(background).or(script).or(scriptasd)
    .or(novenyek);
    warp::serve(routes).run(([0,0,0,0], port)).await;
}

