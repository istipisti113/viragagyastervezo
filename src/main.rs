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
    fajid: i16,
    sortav: i16,
    totav: i16
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

    //minden noveny minden adata
    let novenyek = warp::path!("novenyek").map(||{
        let plants: Vec<noveny> = RequestBuilder::new().url("https://qrugmxvevfhnipzirkdy.supabase.co/rest/v1").table("fajta").select("*").run_struct().unwrap();
        warp::reply::json(&serde_json::to_string(&plants).unwrap())
    });

    let query= warp::path!("query"/String/String).map(|tabla: String, select: String|{
        let plants: Vec<String> = RequestBuilder::new().table(&tabla).select(&select).run_str().unwrap();
        warp::reply::json(&serde_json::to_string(&plants).unwrap())
    });

    let novenynevek= warp::path!("novenynevek").map(||{
        let plants: Vec<String> = RequestBuilder::new().table("fajta").select("neve").run_str().unwrap();
        warp::reply::json(&serde_json::to_string(&plants).unwrap())
    });



    println!("faj id: {}", RequestBuilder::new().table("faj").select("id").run_str().unwrap().join(" "));
    println!("faj nevek: {}", RequestBuilder::new().table("faj").select("neve").run_str().unwrap().join(" "));
    println!("fajta nevek: {}", RequestBuilder::new().table("fajta").select("neve").run_str().unwrap().join(" "));
    let routes = home
    .or(style).or(background).or(script).or(scriptasd)
    .or(novenyek).or(novenynevek).or(query);
    warp::serve(routes).run(([0,0,0,0], port)).await;
}

