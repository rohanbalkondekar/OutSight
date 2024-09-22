// export const models = ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"];
// export const languages = ["", "Rust", "NodeJs","Python", "JavaScript", "TypeScript", "Java", "C#"];


// export const frameworksByLanguage: { [key: string]: string[] } = {
//     Python: ["Django", "FastApi", "Flask"],
//     NodeJs: ["Express.js", "NestJS"],
//     TypeScript: ["React", "Angular", "NestJS"],
//     Rust: ["Actix Web", "Rocket", "Tauri"],
//     JavaScript: ["Express.js", "React", "Angular"],
//     Java: ["Spring", "Struts", "Hibernate"],
//     "C#": ["ASP.NET", "Blazor"],
//   };
  

export const models = [
    "gpt-4o-mini", 
    "gpt-4o", 
    "gpt-4-turbo", 
    "gpt-3.5-turbo"
  ];
  
  export const languages = [
    "", // Option for no language
    "Rust", 
    "NodeJs", 
    "Python", 
    "JavaScript", 
    "TypeScript", 
    "Java", 
    "C#", 
    "Go", 
    "Ruby", 
    "PHP", 
    "Swift", 
    "Kotlin", 
    "Perl", 
    "Objective-C", 
    "Scala", 
    "Elixir", 
    "C", 
    "C++", 
    "R", 
    "Haskell", 
    "Erlang", 
    "Clojure", 
    "Dart", 
    "Lua", 
    "COBOL", 
    "Fortran", 
    "Pascal", 
    "Visual Basic", 
    "Delphi", 
    "Ada", 
    "Assembly", 
    "F#", 
    "VHDL", 
    "Matlab", 
    "Groovy", 
    "Julia", 
    "Tcl", 
    "Prolog", 
    "Scheme", 
    "Lisp"
  ];
  
  export const frameworksByLanguage: { [key: string]: string[] } = {
    "": [""], // No framework option for any language
    Python: ["", "Django", "FastApi", "Flask", "Tornado", "Pyramid", "Web2py"],
    NodeJs: ["", "Express.js", "NestJS", "Koa", "Sails.js"],
    TypeScript: ["", "React", "Angular", "NestJS", "Vue.js", "Svelte"],
    JavaScript: ["", "Express.js", "React", "Angular", "Vue.js", "Svelte", "Next.js"],
    Rust: ["", "Actix Web", "Rocket", "Tauri", "Warp"],
    Java: ["", "Spring", "Struts", "Hibernate", "JSF", "Play Framework"],
    "C#": ["", "ASP.NET", "Blazor", "Nancy", "Orchard CMS"],
    Go: ["", "Gin", "Echo", "Revel", "Buffalo"],
    Ruby: ["", "Rails", "Sinatra", "Hanami"],
    PHP: ["", "Laravel", "Symfony", "CodeIgniter", "Zend Framework", "CakePHP"],
    Swift: ["", "Vapor", "Kitura", "Perfect"],
    Kotlin: ["", "Ktor", "Spring", "Vert.x"],
    Perl: ["", "Dancer", "Catalyst", "Mojolicious"],
    "Objective-C": [""], // No major frameworks outside of iOS development
    Scala: ["", "Play Framework", "Akka HTTP"],
    Elixir: ["", "Phoenix"],
    C: [""], // No widely used web frameworks, C is mostly used for system programming
    "C++": ["", "Wt", "CppCMS"],
    R: [""], // Used mostly for statistical computing, no major web frameworks
    Haskell: ["", "Yesod", "Scotty", "Snap"],
    Erlang: ["", "Cowboy", "Nitrogen"],
    Clojure: ["", "Ring", "Compojure"],
    Dart: ["", "Flutter", "Aqueduct", "Angel"],
    Lua: ["", "Lapis", "Orbit"],
    COBOL: [""], // No major frameworks for web development
    Fortran: [""], // No major frameworks for web development
    Pascal: [""], // Mostly legacy, no modern frameworks
    "Visual Basic": [""], // No major frameworks
    Delphi: ["", "Delphi MVC Framework"],
    Ada: [""], // No major frameworks for web development
    Assembly: [""], // No frameworks for web development, used in low-level programming
    "F#": ["", "Giraffe", "Saturn"],
    VHDL: [""], // Hardware description language, no frameworks
    Matlab: [""], // Used for mathematical computing, no major web frameworks
    Groovy: ["", "Grails"],
    Julia: [""], // No major web frameworks yet
    Tcl: ["", "TclHttpd"],
    Prolog: [""], // Mostly logic programming, no frameworks
    Scheme: [""], // No widely used frameworks
    Lisp: [""], // No widely used frameworks
  };
  