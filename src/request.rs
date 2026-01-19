use std::{env, process::{Command, Output}};
use serde::{Deserialize, Serialize};
use serde_json;

use crate::{noveny, novenybuilder, request};

#[derive(serde::Deserialize, Debug)]
struct novenyrequest{
    id: Option<i16>,
    neve: Option<String>,
    latinneve: Option<String>,
    nemszeret: Option<Vec<i16>>,
    sortav: Option<i16>,
    totav: Option<i16>,
}

impl novenyrequest {
    fn getfield(&self, field: &str)-> Option<String>{
        match field{
            "neve" => {
                match &self.neve {
                    None => None,
                    Some(nev) => Some(nev.to_string())
                }
            }
            "id" => {
                match &self.id {
                    None => None,
                    Some(id) => Some(id.to_string())
                }
            }
            _ => None
        }
    }
}

#[allow(dead_code)]
#[derive(Default)]
pub struct RequestBuilder {
    paramtype: Option<String>,
    param: Vec<String>,
    url: Option<String>,
    method: Option<String>,
    headers: Vec<(String, String)>,
    body: Option<String>,
    table: Option<String>,
    select: Option<String>
}

#[allow(dead_code)]
impl RequestBuilder {
    pub fn new() -> Self {
        Self::default()
    }

    novenybuilder!(url);
    novenybuilder!(method);
    novenybuilder!(body);
    novenybuilder!(table);
    novenybuilder!(select);

    pub fn header(mut self, key: &str, value: &str) -> Self {
        self.headers.push((key.to_string(), value.to_string()));
        self
    }

    pub fn param(mut self, param: &str) -> Self {
        self.param.push(param.to_owned());
        self
    }

    pub fn run_struct(self) -> Result<Vec<noveny>,String> {
        let output = makerequest(self);
        match output.status.success() {
            true=>{
                //;
                let novenyek: Vec<noveny> = serde_json::from_str(&String::from_utf8_lossy(&output.stdout).to_string()).unwrap();
                Ok(novenyek)
            }

            false=>{Err(String::from_utf8_lossy(&output.stderr).to_string())}
        }
    }

    pub fn run_str(self) -> Result<Vec<String>,String> {
        let select = self.select.clone().unwrap_or_default();
        let output = makerequest(self);
        match output.status.success() {
            true=>{
                let mut novenyek: Vec<novenyrequest> = vec![];
                let parsing = &String::from_utf8_lossy(&output.stdout).to_string();
                match serde_json::from_str::<Vec<novenyrequest>>(parsing) {
                    Ok(lista) => {novenyek = lista}
                    Err(error) => {
                        println!("wrong parse: {}", parsing);
                        return Err(error.to_string());
                    }
                }
                let mut returning:Vec<String> = vec![];
                for nov in novenyek{
                        match nov.getfield(&select) {
                            Some(_) => {
                                returning.push(nov.getfield(&select).unwrap().to_string());
                            }
                            None=>{}
                        }
                }
                Ok(returning)
            }
            false=>{Err(String::from_utf8_lossy(&output.stderr).to_string())}
        }
    }
}

fn makerequest(builder: RequestBuilder) -> Output{
    let url = builder.url.unwrap_or("https://qrugmxvevfhnipzirkdy.supabase.co/rest/v1".to_string());
    let method = builder.method.unwrap_or_else(|| "get".to_string());
    let select = builder.select.unwrap_or("*".to_string());

    let key = env::var("apikey").unwrap();

    let mut params: Vec<String> = vec![];
    params.push(format!("--{}", method.to_lowercase()));
    params.push(format!("{}",url+"/"+&builder.table.unwrap()));
    params.push("-H".to_string());
    params.push("apikey: ".to_owned()+&key);
    params.push(String::from("-d"));
    params.push(format!("select={}", select));

    for p in builder.param {
        let mut splitted = p.split("=");
        params.push("-d".to_string());
        params.push(format!("{}=eq.{}",splitted.next().unwrap(), splitted.next().unwrap()))
    }

    let mut command = Command::new("curl");
    command.args(params);
    command.output().unwrap()
}
