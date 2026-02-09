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
            self.$name.push((
                $( $param.to_string(), )*
                ));
            self
        }
    } 
}


#[macro_export]
macro_rules! novenyfield {
    ($self:ident, $field:ident; $($field_name:ident),+) => {
        match $field {
            $(
                stringify!($field_name) => {
                    match &$self.$field_name {
                        None => None,
                        Some(value) => Some(value.to_string())
                    }
                }
            ),+
            _ => None
        }
    };
}
