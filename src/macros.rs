#[macro_export]
macro_rules! novenybuilder {
    ($name:ident) => {
        pub fn $name(mut self, param: &str) -> Self {
        self.$name = Some(param.to_string());
        self
        }
    };
    ($name: ident, $($param:ident),*  ) => {
        pub fn $name(mut self, $( $param:&str ),* ) -> Self{
            self.$name.push( (
                $( $param.to_string() )* ,
                ));
            self
        }
    } 
}
