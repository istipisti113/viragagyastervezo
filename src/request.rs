use std::{env, process::Command};

use crate::request;

#[derive(Default)]
pub struct RequestBuilder {
    paramtype: Option<String>,
    param: Vec<String>,
    url: Option<String>,
    method: Option<String>,
    headers: Vec<(String, String)>,
    body: Option<String>,
    table: Option<String>
}

impl RequestBuilder {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn url(mut self, url: &str) -> Self {
        self.url = Some(url.to_string());
        self
    }

    pub fn method(mut self, method: &str) -> Self {
        self.method = Some(method.to_string());
        self
    }

    pub fn header(mut self, key: &str, value: &str) -> Self {
        self.headers.push((key.to_string(), value.to_string()));
        self
    }

    pub fn body(mut self, body: &str) -> Self {
        self.body = Some(body.to_string());
        self
    }

    pub fn table(mut self, table: &str) -> Self {
        self.table = Some(table.to_string());
        self
    }

    pub fn param(mut self, param: &str) -> Self {
        self.param.push(param.to_owned());
        self
    }

    pub fn run(self) -> String {
        let url = self.url.ok_or("https://qrugmxvevfhnipzirkdy.supabase.co/rest/v1");
        let method = self.method.unwrap_or_else(|| "GET".to_string());

        let mut params: Vec<String> = vec![];
        let key = env::var("apikey").unwrap();
        params.push(url.unwrap().to_string());
        params.push("-H".to_string());
        params.push("apikey: ".to_owned()+&key);

        for p in self.param {
            let mut splitted = p.split("=");
            params.push("-d".to_string());
            params.push(format!("{}=eq.{}",splitted.next().unwrap(), splitted.next().unwrap()))
        }

        //let mut command = Command::new("curl");
        let mut command = Command::new("echo");
        command.args(params);
        let output = command.output().unwrap();
        match output.status.success() {
            true=>{String::from_utf8_lossy(&output.stdout).to_string()}
            false=>{String::from_utf8_lossy(&output.stderr).to_string()}
        }
    }
}

fn request(paramtype: &str, param: &str)->String{
    let key = env::var("apikey").unwrap();
    let a = "apikey: ".to_owned()+&key;

    let mut command = Command::new("curl");
    //output.arg("https://ifconfig.co")
    //output.arg("-H").arg(a).arg("https://qrugmxvevfhnipzirkdy.supabase.co/rest/v1/faj?id=eq.3");
    command.args(["-H", &a, &format!("https://qrugmxvevfhnipzirkdy.supabase.co/rest/v1/faj?{}=eq.{}",paramtype, param)]);

    let output = command.output().unwrap();
    match output.status.success() {
        true=>{String::from_utf8_lossy(&output.stdout).to_string()}
        false=>{String::from_utf8_lossy(&output.stderr).to_string()}
    }
}
